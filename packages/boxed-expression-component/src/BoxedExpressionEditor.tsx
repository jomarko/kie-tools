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

import "@patternfly/react-core/dist/styles/base.css";
import { I18nDictionariesProvider } from "@kie-tools-core/i18n/dist/react-components";
import * as React from "react";
import { BeeGwtService, BoxedExpression, DmnDataType, Normalized, PmmlDocument } from "./api";
import {
  boxedExpressionEditorDictionaries,
  BoxedExpressionEditorI18nContext,
  boxedExpressionEditorI18nDefaults,
} from "./i18n";
import { ExpressionDefinitionRoot } from "./expressions/ExpressionDefinitionRoot/ExpressionDefinitionRoot";
import { BoxedExpressionEditorContextProvider, OnExpressionChange } from "./BoxedExpressionEditorContext";
import { FeelIdentifiers } from "@kie-tools/dmn-feel-antlr4-parser";
import "./@types/react-table";

export type OnRequestFeelIdentifiers = () => FeelIdentifiers;

export interface BoxedExpressionEditorProps {
  /** The API methods which BoxedExpressionEditor component can use to dialog with GWT layer. Although the GWT layer is deprecated, and the new DMN Editor does not have GWT, some methods here are still necessary. */
  beeGwtService?: BeeGwtService;
  /** Id of the Decision or BKM containing `expression` */
  expressionHolderId: string;
  /** Name of the Decision or BKM containing `expression` */
  expressionHolderName: string;
  /** TypeRef of the Decision or BKM containing `expression` */
  expressionHolderTypeRef: string | undefined;
  /** The boxed expression itself */
  expression: Normalized<BoxedExpression> | undefined;
  /** Called every time something changes on the expression */
  onExpressionChange: OnExpressionChange;
  /** KIE Extension to represent IDs of individual columns or expressions */
  widthsById: Map<string, number[]>;
  /** Called every time a width changes on the expression */
  onWidthsChange: React.Dispatch<React.SetStateAction<Map<string, number[]>>>;
  /** A boolean used for making (or not) the reset button available on the root expression. BKMs, for example, can't be reset, as they need to be a Boxed Function. */
  isResetSupportedOnRootExpression?: boolean;
  /** The Data Types available */
  dataTypes: DmnDataType[];
  /** ReadOnly mode flag */
  isReadOnly?: boolean;
  /** PMML models available to use on Boxed PMML Function */
  pmmlDocuments?: PmmlDocument[];
  evaluationHitsCountById?: Map<string, number>;
  /** The containing HTMLElement which is scrollable */
  scrollableParentRef: React.RefObject<HTMLElement>;
  /** Parsed identifiers used for syntax coloring and auto-complete */
  onRequestFeelIdentifiers?: OnRequestFeelIdentifiers;
  /** Hide DMN 1.4 boxed expressions */
  hideDmn14BoxedExpressions?: boolean;
}

export function BoxedExpressionEditor({
  dataTypes,
  isReadOnly,
  expressionHolderId,
  expressionHolderName,
  expressionHolderTypeRef,
  expression,
  onExpressionChange,
  beeGwtService,
  isResetSupportedOnRootExpression,
  scrollableParentRef,
  pmmlDocuments,
  onRequestFeelIdentifiers,
  evaluationHitsCountById,
  widthsById,
  onWidthsChange,
  hideDmn14BoxedExpressions,
}: BoxedExpressionEditorProps) {
  return (
    <I18nDictionariesProvider
      defaults={boxedExpressionEditorI18nDefaults}
      dictionaries={boxedExpressionEditorDictionaries}
      initialLocale={navigator.language}
      ctx={BoxedExpressionEditorI18nContext}
    >
      <BoxedExpressionEditorContextProvider
        scrollableParentRef={scrollableParentRef}
        beeGwtService={beeGwtService}
        expressionHolderId={expressionHolderId}
        expressionHolderName={expressionHolderName}
        expressionHolderTypeRef={expressionHolderTypeRef}
        expression={expression}
        onExpressionChange={onExpressionChange}
        onWidthsChange={onWidthsChange}
        isReadOnly={isReadOnly}
        dataTypes={dataTypes}
        pmmlDocuments={pmmlDocuments}
        onRequestFeelIdentifiers={onRequestFeelIdentifiers}
        evaluationHitsCountById={evaluationHitsCountById}
        widthsById={widthsById}
        hideDmn14BoxedExpressions={hideDmn14BoxedExpressions}
      >
        <ExpressionDefinitionRoot
          expressionHolderId={expressionHolderId}
          expressionHolderName={expressionHolderName}
          expressionHolderTypeRef={expressionHolderTypeRef}
          expression={expression}
          isResetSupported={isResetSupportedOnRootExpression}
        />
      </BoxedExpressionEditorContextProvider>
    </I18nDictionariesProvider>
  );
}
