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
import { DefaultNodeName, NodePosition, NodeType } from "../__fixtures__/nodes";
import { EdgeType } from "../__fixtures__/edges";

test.beforeEach(async ({ editor }) => {
  await editor.open();
});

test.describe("Invalid edge - Authority Requirement", () => {
  test.describe("Invalid edge - Authority Requirement - From Knowledge Source", () => {
    test.beforeEach(async ({ palette }) => {
      await palette.dragNewNode({
        type: NodeType.KNOWLEDGE_SOURCE,
        targetPosition: { x: 100, y: 100 },
        thenRenameTo: "Source Node",
      });
    });

    test("shouldn't add an Authority Requirement edge from Input Data node to Input Data node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.INPUT_DATA,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.AUTHORITY_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.INPUT_DATA,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.INPUT_DATA })).not.toBeAttached();
    });

    test("should dim the target Input Data node", async ({ palette, nodes }) => {
      await palette.dragNewNode({
        type: NodeType.INPUT_DATA,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.startDraggingEdge({ from: "Source Node", edgeType: EdgeType.AUTHORITY_REQUIREMENT });

      await expect(nodes.get({ name: DefaultNodeName.INPUT_DATA })).toHaveClass(/.*dimmed/);
    });

    test("shouldn't add an Authority Requirement edge from Input Data node to Decision Service node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.DECISION_SERVICE,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.AUTHORITY_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.DECISION_SERVICE,
        position: NodePosition.TOP,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.DECISION_SERVICE })).not.toBeAttached();
    });

    test("should dim the target Decision Service node", async ({ palette, nodes }) => {
      await palette.dragNewNode({
        type: NodeType.DECISION_SERVICE,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.startDraggingEdge({ from: "Source Node", edgeType: EdgeType.AUTHORITY_REQUIREMENT });

      await expect(nodes.get({ name: DefaultNodeName.DECISION_SERVICE })).toHaveClass(/.*dimmed/);
    });

    test("shouldn't add an Authority Requirement edge from Input Data node to Group node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.GROUP,
        targetPosition: { x: 400, y: 400 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.AUTHORITY_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.GROUP,
        position: NodePosition.TOP,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.GROUP })).not.toBeAttached();
    });

    test("should dim the target Group node", async ({ palette, nodes }) => {
      await palette.dragNewNode({
        type: NodeType.GROUP,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.startDraggingEdge({ from: "Source Node", edgeType: EdgeType.AUTHORITY_REQUIREMENT });

      await expect(nodes.get({ name: DefaultNodeName.GROUP })).toHaveClass(/.*dimmed/);
    });

    test("shouldn't add an Authority Requirement edge from Input Data node to Text Annotation node", async ({
      palette,
      nodes,
      edges,
    }) => {
      await palette.dragNewNode({
        type: NodeType.TEXT_ANNOTATION,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.dragNewConnectedEdge({
        type: EdgeType.AUTHORITY_REQUIREMENT,
        from: "Source Node",
        to: DefaultNodeName.TEXT_ANNOTATION,
      });

      expect(await edges.get({ from: "Source Node", to: DefaultNodeName.TEXT_ANNOTATION })).not.toBeAttached();
    });

    test("should dim the target Text Annotation node", async ({ palette, nodes }) => {
      await palette.dragNewNode({
        type: NodeType.TEXT_ANNOTATION,
        targetPosition: { x: 300, y: 100 },
      });

      await nodes.startDraggingEdge({ from: "Source Node", edgeType: EdgeType.AUTHORITY_REQUIREMENT });

      await expect(nodes.get({ name: DefaultNodeName.TEXT_ANNOTATION })).toHaveClass(/.*dimmed/);
    });
  });
});
