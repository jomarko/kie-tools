/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
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

/// <reference types="cypress" />
/// <reference types="cypress-iframe" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Search elements by data-ouia component attributes.
     * @param type string
     * @param id string
     * @param opts optional - config object
     */
    ouiaId(
      type: string,
      id: string,
      opts?: Record<string, any>
    ): Chainable<Element>;

    /**
     *
     * @param type string
     * @param opts optional - config object
     */
    ouiaType(type: string, opts?: Record<string, any>): Chainable<Element>;

    /**
     * Make sure the ditor is loaded.
     * @param editorIds string ids of the editor elements
     * @param options config object
     */
    loadEditor(
      editorIds: string[] | string,
      options?: Record<string, unknown>
    ): void;

    /**
     * Locate the editor component for interaction.
     * @param id
     */
    editor(id: string, options?: Record<string, any>): Chainable<Element>;

    /**
     * Upload file using elements with type file-loader and given id.
     * @param fileName string name of the file
     * @param componentId string id of the element
     */
    uploadFile(fileName: string, componentId?: string): Chainable<Element>;

    /**
     * Load file contents into editor by clicking the View button near the file-list item.
     * @param fileName string name of the file
     * @param componentId string id of the element
     */
    viewFile(fileName: string, componentId?: string): Chainable<Element>;
  }
}
