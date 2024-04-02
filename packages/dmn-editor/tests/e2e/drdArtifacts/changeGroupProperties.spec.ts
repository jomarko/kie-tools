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

test.beforeEach(async ({ editor }) => {
  await editor.open();
});

test.describe("Change Properties - Group", () => {
  test.beforeEach(async ({ palette, nodes, groupPropertiesPanel }) => {
    await palette.dragNewNode({ type: NodeType.GROUP, targetPosition: { x: 100, y: 100 } });
    await nodes.select({ name: DefaultNodeName.GROUP, position: NodePosition.TOP });
    await groupPropertiesPanel.open();
  });

  test("should change the Group node name", async ({ nodes, groupPropertiesPanel }) => {
    await groupPropertiesPanel.setName({ from: DefaultNodeName.GROUP, to: "Renamed Group" });

    await expect(nodes.get({ name: "Renamed Group" })).toBeVisible();
    expect(await groupPropertiesPanel.getName({ nodeName: "Renamed Group" })).toBe("Renamed Group");
  });

  test("should change the Group node description", async ({ groupPropertiesPanel }) => {
    await groupPropertiesPanel.setDescription({
      nodeName: DefaultNodeName.GROUP,
      newDescription: "New Group Description",
    });

    expect(await groupPropertiesPanel.getNodeDescription({ nodeName: DefaultNodeName.GROUP })).toBe(
      "New Group Description"
    );
  });

  test("should change the Group node font - family", async ({ groupPropertiesPanel }) => {
    await groupPropertiesPanel.setFont({ nodeName: DefaultNodeName.GROUP, newFont: "Verdana" });

    expect(await groupPropertiesPanel.getNodeFont({ nodeName: DefaultNodeName.GROUP })).toBe("Verdana");
  });

  test.skip("should change the Group node shape - background color", async ({ nodes, groupPropertiesPanel }) => {
    // blocked https://github.com/microsoft/playwright/issues/19929#issuecomment-1377035969
  });
});
