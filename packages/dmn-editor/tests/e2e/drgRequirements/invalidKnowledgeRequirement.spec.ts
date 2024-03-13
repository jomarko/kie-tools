/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { test, expect } from "../__fixtures__/base";
import { DefaultNodeName, NodeType } from "../__fixtures__/nodes";
import { EdgeType } from "../__fixtures__/edges";

test.beforeEach(async ({ editor }) => {
  await editor.open();
});

test.describe("Invalid edge - Knowledge Requirement", () => {
  test.describe("BKM", () => {
    test.beforeEach(async ({ palette }) => {
      await palette.dragNewNode({
        type: NodeType.BKM,
        targetPosition: { x: 100, y: 100 },
        thenRenameTo: "Source Node",
      });
    });

    test("shouldn't add an Knowledge Requirement edge from Input Data node to Input Data node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.INPUT_DATA,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.KNOWLEDGE_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.INPUT_DATA,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.INPUT_DATA })).not.toBeAttached();
    });

    test("shouldn't add an Knowledge Requirement edge from Input Data node to Knowledge Source node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.KNOWLEDGE_SOURCE,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.KNOWLEDGE_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.KNOWLEDGE_SOURCE,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.KNOWLEDGE_SOURCE })).not.toBeAttached();
    });

    test.skip("shouldn't add an Knowledge Requirement edge from Input Data node to Group node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.GROUP,
        targetPosition: { x: 400, y: 400 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.KNOWLEDGE_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.GROUP,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.GROUP })).not.toBeAttached();
    });

    test("shouldn't add an Knowledge Requirement edge from Input Data node to Text Annotation node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.TEXT_ANNOTATION,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.KNOWLEDGE_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.TEXT_ANNOTATION,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.TEXT_ANNOTATION })).not.toBeAttached();
    });
  });
});
