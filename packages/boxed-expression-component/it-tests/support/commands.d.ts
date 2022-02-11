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

declare namespace Cypress {
  interface Chainable {
    /**
     * Search elements by data-ouia-component-id attribute.
     * @param id string
     * @param opts optional - config object
     */
    ouiaId(id: string, opts?: Record<string, any>): Chainable<Element>;

    ouiaType(type: string, opts?: Record<string, any>): Chainable<Element>;

    /**
     * Type tab. This should be supported in future Cypress version and this function can be removed after that.
     * Requires the selected element to have the focus.
     * https://github.com/cypress-io/cypress/issues/299
     */
    typeTab: (shiftKey?: boolean) => Chainable<Element>;
  }
}
