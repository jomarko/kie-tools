/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
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

import * as buildEnv from "@kogito-tooling/build-env";

describe("DMN Runner Test", () => {
  beforeEach(() => {
    cy.visit(`http://localhost:${buildEnv.onlineEditor.dev.port}/`);
  });

  it("set up DMN Runner", () => {
    // click Create new decision model button (new DMN)
    cy.get("[data-ouia-component-id='new-dmn-button']").click();

    // wait until loading dialog disappears
    cy.loadEditor();

    // check editor logo
    cy.get("[class='pf-c-brand']").within(($logo) => {
      expect($logo.attr("src")).contain("dmn");
      expect($logo.attr("alt")).contain("dmn");
    });

    // start the DMN Runner set up
    cy.get("[data-ouia-component-id='dmn-guided-tour'] button").contains("Skip tour and start DMN Runner").click();
  });
});
