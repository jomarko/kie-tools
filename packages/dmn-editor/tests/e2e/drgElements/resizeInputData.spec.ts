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

test.beforeEach(async ({ editor }) => {
  await editor.open();
});

test.describe("Resize node - Input Data", () => {
  test.describe("Resize with snapping turned off", () => {
    test.beforeEach(async ({ overlays, palette }) => {
      await overlays.turnOffSnapping();
      await palette.dragNewNode({ type: NodeType.INPUT_DATA, targetPosition: { x: 100, y: 100 } });
    });

    test("should increase Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 50, yOffset: 50 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("210");
      expect(height).toEqual("130");
    });

    test("should decrease Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 100, yOffset: 100 });
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: -20, yOffset: -20 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("240");
      expect(height).toEqual("160");
    });

    test("should not decrease below minimal Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: -50, yOffset: -50 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("160");
      expect(height).toEqual("80");
    });
  });

  test.describe("Resize with snapping turned on", () => {
    test.beforeEach(async ({ palette }) => {
      await palette.dragNewNode({ type: NodeType.INPUT_DATA, targetPosition: { x: 100, y: 100 } });
    });

    test("should increase Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 50, yOffset: 50 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("200");
      expect(height).toEqual("120");
    });

    test("should decrease Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 100, yOffset: 100 });
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: -20, yOffset: -20 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("240");
      expect(height).toEqual("160");
    });

    test("should not decrease below minimal Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: -50, yOffset: -50 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("160");
      expect(height).toEqual("80");
    });
  });

  test.describe("Resize with non default snapping", () => {
    test.beforeEach(async ({ overlays, palette }) => {
      await overlays.setSnapping({ horizontal: "50", vertical: "50" });
      await palette.dragNewNode({ type: NodeType.INPUT_DATA, targetPosition: { x: 100, y: 100 } });
    });

    test("should increase Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 50, yOffset: 50 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("250");
      expect(height).toEqual("150");
    });

    test("should decrease Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 100, yOffset: 100 });
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: -20, yOffset: -20 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("250");
      expect(height).toEqual("150");
    });

    test("should not decrease below minimal Input Data node size", async ({ nodes, inputDataPropertiesPanel }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: -50, yOffset: -50 });

      await inputDataPropertiesPanel.open();
      await nodes.select({ name: DefaultNodeName.INPUT_DATA });
      const { width, height } = await inputDataPropertiesPanel.getShape();
      expect(width).toEqual("200");
      expect(height).toEqual("100");
    });
  });

  test.describe("Resize on top of other node - Input Data", () => {
    test.beforeEach(async ({ palette }) => {
      await palette.dragNewNode({ type: NodeType.DECISION, targetPosition: { x: 250, y: 150 } });
      await palette.dragNewNode({ type: NodeType.INPUT_DATA, targetPosition: { x: 100, y: 100 } });
    });

    test("should resize Input Data on top of Decision node", async ({ nodes, diagram }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 200, yOffset: 0 });

      await expect(diagram.get()).toHaveScreenshot("resize-input-data-on-top-of-decision.png");
    });

    test("should resize back Input Data that is on top of Decision node", async ({ nodes, diagram }) => {
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: 200, yOffset: 0 });
      await diagram.resetFocus();
      await nodes.resize({ nodeName: DefaultNodeName.INPUT_DATA, xOffset: -200, yOffset: 0 });

      await expect(diagram.get()).toHaveScreenshot("resize-back-input-data-on-top-of-decision.png");
    });
  });
});
