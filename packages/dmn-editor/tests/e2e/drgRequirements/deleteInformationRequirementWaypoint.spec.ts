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

import { expect } from "@playwright/test";
import { test } from "../__fixtures__/base";
import { DefaultNodeName, NodeType } from "../__fixtures__/nodes";
import { TestAnnotations } from "@kie-tools/playwright-base/annotations";

test.beforeEach(async ({ editor }) => {
  await editor.open();
});

test.describe("Delete edge waypoint - Information Requirement", () => {
  test.beforeEach(async ({ palette, nodes, browserName }) => {
    test.skip(browserName === "webkit", "https://github.com/apache/incubator-kie-issues/issues/991");
    test.info().annotations.push({
      type: TestAnnotations.REGRESSION,
      description: "https://github.com/apache/incubator-kie-issues/issues/991",
    });

    await palette.dragNewNode({ type: NodeType.INPUT_DATA, targetPosition: { x: 100, y: 100 } });
    await nodes.dragNewConnectedNode({
      from: DefaultNodeName.INPUT_DATA,
      type: NodeType.DECISION,
      targetPosition: { x: 100, y: 300 },
    });
  });

  test("should delete first waypoint of the Information Requirement edge and second waypoint should stay", async ({
    diagram,
    nodes,
    edges,
  }) => {
    await edges.addWaypoint({ from: DefaultNodeName.INPUT_DATA, to: DefaultNodeName.DECISION });
    const boundingBox = await nodes.get({ name: DefaultNodeName.DECISION }).boundingBox();
    await nodes
      .get({ name: DefaultNodeName.DECISION })
      .dragTo(diagram.get(), { targetPosition: { x: 100 + (boundingBox?.width ?? 0) / 2, y: 500 } });

    await edges.addWaypoint({ from: DefaultNodeName.INPUT_DATA, to: DefaultNodeName.DECISION });
    await nodes.get({ name: DefaultNodeName.DECISION }).dragTo(diagram.get(), { targetPosition: { x: 500, y: 500 } });
    await nodes.get({ name: DefaultNodeName.INPUT_DATA }).dragTo(diagram.get(), { targetPosition: { x: 500, y: 100 } });

    await edges.deleteNthWaypoint({ from: DefaultNodeName.INPUT_DATA, to: DefaultNodeName.DECISION, nth: 1 });

    await expect(diagram.get()).toHaveScreenshot();
  });
});
