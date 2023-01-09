/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ContextExpressionDefinitionEntry, DmnBuiltInDataType, ExpressionDefinition } from "../../api";
import * as React from "react";
import { useCallback, useMemo } from "react";
import * as _ from "lodash";
import { useBeeTableCell } from "../../table/BeeTable/BeeTableSelectionContext";
import { ExpressionDefinitionHeaderMenu } from "../ExpressionDefinitionHeaderMenu";
import "./ContextEntryInfoCell.css";

export interface ContextEntryInfoCellProps {
  // This name ('data') can't change, as this is used on "cellComponentByColumnId".
  data: readonly ContextExpressionDefinitionEntry[];
  onEntryUpdate: (rowIndex: number, newEntry: ContextExpressionDefinitionEntry) => void;
  rowIndex: number;
  columnIndex: number;
  columnId: string;
}

export const ContextEntryInfoCell: React.FunctionComponent<ContextEntryInfoCellProps> = ({
  data: contextEntries,
  rowIndex,
  columnIndex,
  onEntryUpdate,
}) => {
  const contextEntry = useMemo(() => contextEntries[rowIndex], [contextEntries, rowIndex]);
  const entryInfo = useMemo(() => contextEntry.entryInfo, [contextEntry.entryInfo]);
  const entryExpression = useMemo(() => contextEntry.entryExpression, [contextEntry.entryExpression]);

  const onContextEntryUpdate = useCallback(
    ({ name = "", dataType = DmnBuiltInDataType.Undefined }: Pick<ExpressionDefinition, "name" | "dataType">) => {
      const updatedExpression = { ...entryExpression };
      if (contextEntry.nameAndDataTypeSynchronized && _.size(name) && _.size(dataType)) {
        updatedExpression.name = name;
        updatedExpression.dataType = dataType;
      }
      onEntryUpdate(rowIndex, {
        ...contextEntry,
        entryExpression: updatedExpression,
        entryInfo: { id: entryInfo.id, name, dataType },
      });
    },
    [entryExpression, contextEntry, rowIndex, onEntryUpdate, entryInfo.id]
  );

  useBeeTableCell(
    rowIndex,
    columnIndex,
    undefined,
    useCallback(() => `${entryInfo.name} (${entryInfo.dataType})`, [entryInfo.dataType, entryInfo.name])
  );

  const onExpressionHeaderUpdated = useCallback(
    (args: Pick<ExpressionDefinition, "name" | "dataType">) => {
      onContextEntryUpdate(args);
    },
    [onContextEntryUpdate]
  );

  const renderEntryDefinition = useCallback(
    (args: { additionalCssClass?: string }) => (
      <div className={`expression-info ${args.additionalCssClass}`}>
        <p className="expression-info-name pf-u-text-truncate" title={entryInfo.name}>
          {entryInfo.name}
        </p>
        <p className="expression-info-data-type pf-u-text-truncate" title={entryInfo.dataType}>
          ({entryInfo.dataType})
        </p>
      </div>
    ),
    [entryInfo]
  );

  return (
    <div className="context-entry-info-cell">
      <div className={`${entryInfo.id} entry-info`}>
        <ExpressionDefinitionHeaderMenu
          selectedExpressionName={entryInfo.name}
          selectedDataType={entryInfo.dataType}
          onExpressionHeaderUpdated={onExpressionHeaderUpdated}
        >
          {renderEntryDefinition({ additionalCssClass: "with-popover-menu" })}
        </ExpressionDefinitionHeaderMenu>
      </div>
    </div>
  );
};