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
import { DataType } from "../__fixtures__/jsonModel";
import { DefaultNodeName, NodeType } from "../__fixtures__/nodes";

test.beforeEach(async ({ editor }) => {
  await editor.open();
});

test.describe("Change Properties - BKM", () => {
  test.beforeEach(async ({ palette, nodes, propertiesPanel }) => {
    await palette.dragNewNode({ type: NodeType.BKM, targetPosition: { x: 100, y: 100 } });
    await nodes.select({ name: DefaultNodeName.BKM });
    await propertiesPanel.open();
  });

  test("should change the BKM node name", async ({ nodes, propertiesPanel }) => {
    await propertiesPanel.changeNodeName({ from: DefaultNodeName.BKM, to: "Renamed BKM" });

    await expect(nodes.get({ name: "Renamed BKM" })).toBeVisible();
  });

  test("should change the BKM node data type", async ({ nodes, propertiesPanel }) => {
    await propertiesPanel.changeNodeDataType({ nodeName: DefaultNodeName.BKM, newDataType: DataType.Number });

    await nodes.hover({ name: DefaultNodeName.BKM });
    await expect(nodes.get({ name: DefaultNodeName.BKM }).getByPlaceholder("Select a data type...")).toHaveValue(
      DataType.Number
    );
  });

  test("should change the BKM node description", async ({ propertiesPanel }) => {
    await propertiesPanel.changeNodeDescription({
      nodeName: DefaultNodeName.BKM,
      newDescription: "New BKM Description",
    });

    expect(await propertiesPanel.getNodeDescription({ nodeName: DefaultNodeName.BKM })).toBe("New BKM Description");
  });

  test("should change the BKM node documentation links", async ({ propertiesPanel }) => {
    await propertiesPanel.addDocumentationLink({
      nodeName: DefaultNodeName.BKM,
      linkText: "Link Text",
      linkHref: "http://link.test.com",
    });

    const links = await propertiesPanel.getDocumentationLinks({ nodeName: DefaultNodeName.BKM });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveText("Link Text");
    expect(links[0]).toHaveAttribute("href", "http://link.test.com/");
  });

  test("should change the BKM node font - family", async ({ propertiesPanel }) => {
    await propertiesPanel.changeNodeFont({ nodeName: DefaultNodeName.BKM, newFont: "Verdana" });

    expect(await propertiesPanel.getNodeFont({ nodeName: DefaultNodeName.BKM })).toBe("Verdana");
  });

  test.skip("should change the BKM node shape - background color", async ({ nodes, propertiesPanel }) => {
    // blocked https://github.com/microsoft/playwright/issues/19929#issuecomment-1377035969
  });
});
