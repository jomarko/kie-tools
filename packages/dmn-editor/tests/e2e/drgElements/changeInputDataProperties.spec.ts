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

test.describe("Change Properties - Input Data", () => {
  test.beforeEach(async ({ palette, nodes, inputDataPropertiesPanel }) => {
    await palette.dragNewNode({ type: NodeType.INPUT_DATA, targetPosition: { x: 100, y: 100 } });
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.open();
  });

  test("should change the Input Data node name", async ({ nodes, inputDataPropertiesPanel }) => {
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.setName({ newName: "Renamed Input Data" });

    await nodes.select({ name: "Renamed Input Data" });
    await expect(nodes.get({ name: "Renamed Input Data" })).toBeVisible();
    expect(await inputDataPropertiesPanel.getName()).toBe("Renamed Input Data");
  });

  test("should change the Input Data node data type", async ({ nodes, inputDataPropertiesPanel }) => {
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.setDataType({ newDataType: DataType.Number });

    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await nodes.hover({ name: DefaultNodeName.INPUT_DATA });
    await expect(nodes.get({ name: DefaultNodeName.INPUT_DATA }).getByPlaceholder("Select a data type...")).toHaveValue(
      DataType.Number
    );
  });

  test("should change the Input Data node description", async ({ nodes, inputDataPropertiesPanel }) => {
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.setDescription({
      newDescription: "New Input Data Description",
    });

    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    expect(await inputDataPropertiesPanel.getDescription()).toBe("New Input Data Description");
  });

  test("should change the Input Data node documentation links", async ({ nodes, inputDataPropertiesPanel }) => {
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.addDocumentationLink({
      linkText: "Link Text",
      linkHref: "http://link.test.com",
    });

    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    const links = await inputDataPropertiesPanel.getDocumentationLinks();
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveText("Link Text");
    expect(links[0]).toHaveAttribute("href", "http://link.test.com/");
  });

  test("should change the Input Data node font - family", async ({ nodes, inputDataPropertiesPanel }) => {
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.setFont({ newFont: "Verdana" });

    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    expect(await inputDataPropertiesPanel.getFont()).toBe("Verdana");
  });

  test("should change the Input Data node shape - fill color", async ({ nodes, inputDataPropertiesPanel }) => {
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.setFillColor({ color: "#f12200" });

    // It's necessary to pick the parent element ".." to have access to the SVG.
    await expect(nodes.get({ name: DefaultNodeName.INPUT_DATA }).locator("..").locator("rect").nth(0)).toHaveAttribute(
      "fill",
      "rgba(241, 34, 0, 0.9)"
    );
  });

  test("should change the Input Data node shape - stroke color", async ({ nodes, inputDataPropertiesPanel }) => {
    await nodes.select({ name: DefaultNodeName.INPUT_DATA });
    await inputDataPropertiesPanel.setStrokeColor({ color: "#f12200" });

    // It's necessary to pick the parent element ".." to have access to the SVG.
    await expect(nodes.get({ name: DefaultNodeName.INPUT_DATA }).locator("..").locator("rect").nth(0)).toHaveAttribute(
      "stroke",
      "rgba(241, 34, 0, 1)"
    );
  });
});
