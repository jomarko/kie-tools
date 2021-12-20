/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe("DMN Editor :: Load Large Model :: Nodes", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("38 unique nodes with layout", () => {
    // upload dmn file from fixtures directory by drag and drop
    cy.get("#upload-field").attachFile("load_tests/dmn/large-model-nodes-38-unique-layout.dmn", {
      subjectType: "drag-n-drop",
    });

    // wait until loading dialog disappears
    cy.loadEditor();

    // check editor title name
    cy.get("[aria-label='Edit file name']").should("have.value", "large-model-nodes-38-unique-layout");

    // close DMN guided tour dialog
    cy.ouia({ ouiaId: "dmn-guided-tour" }).find("button[aria-label='Close']").click();

    cy.getEditor().within(() => {
      // open decision navigator and check nodes
      cy.get("[data-title='Decision Navigator']").click();
      cy.get("li[data-i18n-prefix='DecisionNavigatorTreeView.']").should(($nodes) => {
        expect($nodes.find("[title*='anonym_']")).length(38);
      });
    });
  });

  it("225 node copies with layout", () => {
    // upload dmn file from fixtures directory by drag and drop
    cy.get("#upload-field").attachFile("load_tests/dmn/large-model-nodes-225-copies.dmn", {
      subjectType: "drag-n-drop",
    });

    // wait until loading dialog disappears
    cy.loadEditor();

    // check editor title name
    cy.get("[aria-label='Edit file name']").should("have.value", "large-model-nodes-225-copies");

    // close DMN guided tour dialog
    cy.ouia({ ouiaId: "dmn-guided-tour" }).find("button[aria-label='Close']").click();

    cy.getEditor().within(() => {
      // open decision navigator and check nodes
      cy.get("[data-title='Decision Navigator']").click();
      cy.get("li[data-i18n-prefix='DecisionNavigatorTreeView.']").should(($nodes) => {
        expect($nodes.find("[title*='Decision-1']")).length(225);
      });
    });
  });

  it("50 unique nodes without layout", () => {
    // upload dmn file from fixtures directory by drag and drop
    cy.get("#upload-field").attachFile("load_tests/dmn/large-model-nodes-50-unique-no-layout.dmn", {
      subjectType: "drag-n-drop",
    });

    // wait until loading dialog disappears
    cy.loadEditor();

    // check editor title name
    cy.get("[aria-label='Edit file name']").should("have.value", "large-model-nodes-50-unique-no-layout");

    // close DMN guided tour dialog
    cy.ouia({ ouiaId: "dmn-guided-tour" }).find("button[aria-label='Close']").click();

    cy.getEditor().within(() => {
      // open decision navigator and check nodes
      cy.get("[data-title='Decision Navigator']").click();
      cy.get("li[data-i18n-prefix='DecisionNavigatorTreeView.']").should(($nodes) => {
        expect($nodes.find("[title*='Decision ']")).length(50);
      });
    });
  });
});
