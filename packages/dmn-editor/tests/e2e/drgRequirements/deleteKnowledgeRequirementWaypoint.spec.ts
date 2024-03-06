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

test.describe("Delete edge waypoint - Knowledge Requirement", () => {
  test.beforeEach(async ({ palette, nodes, browserName }) => {
    test.skip(browserName === "webkit", "https://github.com/apache/incubator-kie-issues/issues/991");
    test.info().annotations.push({
      type: TestAnnotations.REGRESSION,
      description: "https://github.com/apache/incubator-kie-issues/issues/991",
    });

    await palette.dragNewNode({ type: NodeType.BKM, targetPosition: { x: 100, y: 100 } });
    await nodes.dragNewConnectedNode({
      from: DefaultNodeName.BKM,
      type: NodeType.DECISION,
      targetPosition: { x: 100, y: 300 },
    });
  });

  test("should delete the single Knowledge Requirement edge waypoint to make it straight", async ({
    diagram,
    edges,
  }) => {
    await edges.addWaypoint({ from: DefaultNodeName.BKM, to: DefaultNodeName.DECISION });
    await edges.moveNthWaypoint({
      from: DefaultNodeName.BKM,
      to: DefaultNodeName.DECISION,
      nth: 1,
      targetPosition: { x: 300, y: 300 },
    });

    await expect(diagram.get()).toHaveScreenshot("add-knowledge-requirement-waypoint-and-move-it.png");

    await edges.deleteNthWaypoint({
      from: DefaultNodeName.BKM,
      to: DefaultNodeName.DECISION,
      nth: 1,
    });

    await expect(diagram.get()).toHaveScreenshot("delete-knowledge-requirement-waypoint-straight-edge.png");
  });

  test("should delete one of Knowledge Requirement edge waypoints to reduce edge corner", async ({
    diagram,
    nodes,
    edges,
  }) => {
    await edges.addWaypoint({ from: DefaultNodeName.BKM, to: DefaultNodeName.DECISION });
    await nodes.move({ name: DefaultNodeName.DECISION, targetPosition: { x: 200, y: 500 } });

    await edges.addWaypoint({ from: DefaultNodeName.BKM, to: DefaultNodeName.DECISION });

    await edges.moveNthWaypoint({
      from: DefaultNodeName.BKM,
      to: DefaultNodeName.DECISION,
      nth: 1,
      targetPosition: { x: 500, y: 100 },
    });
    await edges.moveNthWaypoint({
      from: DefaultNodeName.BKM,
      to: DefaultNodeName.DECISION,
      nth: 2,
      targetPosition: { x: 500, y: 500 },
    });

    await expect(diagram.get()).toHaveScreenshot("add-multiple-knowledge-requirement-waypoints-and-not-move-them.png");

    await edges.deleteNthWaypoint({
      from: DefaultNodeName.BKM,
      to: DefaultNodeName.DECISION,
      nth: 1,
    });
    await expect(diagram.get()).toHaveScreenshot("delete-knowledge-requirement-waypoint-edge-with-corner.png");
  });
});
