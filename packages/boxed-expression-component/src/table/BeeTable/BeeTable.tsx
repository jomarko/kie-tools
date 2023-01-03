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

import * as PfReactTable from "@patternfly/react-table";
import * as _ from "lodash";
import * as React from "react";
import { useCallback, useMemo, useRef } from "react";
import * as ReactTable from "react-table";
import { v4 as uuid } from "uuid";
import { BeeTableHeaderVisibility, BeeTableProps } from "../../api";
import { useBoxedExpressionEditor } from "../../expressions/BoxedExpressionEditor/BoxedExpressionEditorContext";
import { BEE_TABLE_ROW_INDEX_COLUMN_WIDTH } from "../../expressions/ContextExpression";
import { NavigationKeysUtils } from "../../keysUtils";
import { ResizingWidth } from "../../resizing/ResizingWidthsContext";
import "./BeeTable.css";
import { BeeTableBody } from "./BeeTableBody";
import { BeeTableColumnResizingWidthsContextProvider } from "./BeeTableColumnResizingWidthsContextProvider";
import { BeeTableContextMenuHandler } from "./BeeTableContextMenuHandler";
import { BeeTableEditableCellContent } from "./BeeTableEditableCellContent";
import { BeeTableCellUpdate, BeeTableHeader } from "./BeeTableHeader";
import {
  BeeTableSelectionContextProvider,
  SelectionPart,
  useBeeTableCell,
  useBeeTableSelectionDispatch,
} from "./BeeTableSelectionContext";

const ROW_INDEX_COLUMN_ACCESOR = "#";
const ROW_INDEX_SUB_COLUMN_ACCESSOR = "0";

export function getColumnsAtLastLevel<R extends ReactTable.Column<any> | ReactTable.ColumnInstance<any>>(
  columns: R[],
  depth: number = 0
): R[] {
  return _.flatMap(columns, (column) => {
    if (!column.columns) {
      return column;
    }

    return depth > 0
      ? getColumnsAtLastLevel(column.columns as R[], depth - 1) // recurse
      : (column.columns as R[]);
  });
}

export function areEqualColumns<R extends object>(
  column: ReactTable.Column<R> | ReactTable.ColumnInstance<R> | undefined
): (other: ReactTable.Column<R> | ReactTable.ColumnInstance<R>) => boolean {
  const columnId = column?.originalId || column?.id || column?.accessor;
  return (other: ReactTable.Column<R>) => {
    return other.id === columnId || other.accessor === columnId;
  };
}

export function BeeTable2<R extends object>({
  tableId,
  additionalRow,
  editColumnLabel,
  isEditableHeader = true,
  onCellUpdates,
  onColumnUpdates,
  onRowAdded,
  onRowDuplicated,
  onRowDeleted,
  onColumnAdded,
  onColumnDeleted,
  controllerCell = ROW_INDEX_COLUMN_ACCESOR,
  cellComponentByColumnId,
  rows,
  columns,
  operationConfig,
  headerVisibility,
  headerLevelCount = 0,
  skipLastHeaderGroup = false,
  getRowKey,
  getColumnKey,
  isReadOnly = false,
  enableKeyboardNavigation = true,
}: BeeTableProps<R>) {
  const { resetSelectionAt, erase, copy, cut, paste, adaptSelection, mutateSelection } = useBeeTableSelectionDispatch();
  const tableComposableRef = useRef<HTMLTableElement>(null);
  const { currentlyOpenContextMenu } = useBoxedExpressionEditor();

  const tableRef = React.useRef<HTMLDivElement>(null);

  const addRowIndexColumnsRecursively: <R extends object>(
    column: ReactTable.Column<R>,
    headerLevelCount: number
  ) => void = useCallback(
    (column, headerLevelCount) => {
      if (headerLevelCount > 0) {
        _.assign(column, {
          columns: [
            {
              label:
                headerVisibility === BeeTableHeaderVisibility.AllLevels
                  ? ROW_INDEX_SUB_COLUMN_ACCESSOR
                  : (controllerCell as any), // FIXME: Tiago -> Not good.
              accessor: ROW_INDEX_SUB_COLUMN_ACCESSOR as any,
              minWidth: BEE_TABLE_ROW_INDEX_COLUMN_WIDTH,
              width: BEE_TABLE_ROW_INDEX_COLUMN_WIDTH,
              isRowIndexColumn: true,
              dataType: undefined as any,
            } as ReactTable.Column<R>,
          ],
        });

        if (column.columns?.length) {
          addRowIndexColumnsRecursively(column.columns[0], headerLevelCount - 1);
        }
      }
    },
    [controllerCell, headerVisibility]
  );

  const addRowIndexColumns = useCallback<
    (controllerCell: string | JSX.Element, columns: ReactTable.Column<R>[]) => ReactTable.Column<R>[]
  >(
    (currentControllerCell, columns) => {
      const rowIndexColumn: ReactTable.Column<R> = {
        label: currentControllerCell as any, //FIXME: Tiago -> No bueno.
        accessor: ROW_INDEX_COLUMN_ACCESOR as any,
        width: BEE_TABLE_ROW_INDEX_COLUMN_WIDTH,
        minWidth: BEE_TABLE_ROW_INDEX_COLUMN_WIDTH,
        isRowIndexColumn: true,
        dataType: undefined as any, // FIXME: Tiago -> No bueno.
      };

      addRowIndexColumnsRecursively(rowIndexColumn, headerLevelCount);

      return [rowIndexColumn, ...columns];
    },
    [addRowIndexColumnsRecursively, headerLevelCount]
  );

  const columnsWithAddedIndexColumns = useMemo(
    () => addRowIndexColumns(controllerCell, columns),
    [addRowIndexColumns, columns, controllerCell]
  );

  const defaultColumn = useMemo(
    () => ({
      Cell: (cellProps: ReactTable.CellProps<R>) => {
        const CellComponentForColumn = cellComponentByColumnId?.[cellProps.column.id];
        if (CellComponentForColumn) {
          return (
            <CellComponentForColumn
              data={cellProps.data}
              rowIndex={cellProps.row.index}
              columnIndex={cellProps.allColumns.findIndex((c) => c.id === cellProps.column.id)}
              columnId={cellProps.column.id}
            />
          );
        } else {
          return <BeeTableDefaultCell cellProps={cellProps} onCellUpdates={onCellUpdates} isReadOnly={isReadOnly} />;
        }
      },
    }),
    [cellComponentByColumnId, isReadOnly, onCellUpdates]
  );

  const reactTableInstance = ReactTable.useTable<R>(
    {
      columns: columnsWithAddedIndexColumns,
      data: rows,
      defaultColumn,
    },
    ReactTable.useBlockLayout
  );

  const onGetColumnKey = useCallback<(column: ReactTable.ColumnInstance<R>) => string>(
    (column) => {
      return getColumnKey ? getColumnKey(column) : column.originalId || column.id;
    },
    [getColumnKey]
  );

  const onGetRowKey = useCallback(
    (row: ReactTable.Row<R>) => {
      if (getRowKey) {
        return getRowKey(row);
      } else {
        if (row.original) {
          // FIXME: Tiago -> Bad typing.
          return (row.original as any).id;
        }
        return row.id;
      }
    },
    [getRowKey]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enableKeyboardNavigation) {
        return;
      }

      if (currentlyOpenContextMenu) {
        return;
      }

      // ENTER
      if (NavigationKeysUtils.isEnter(e.key) && !e.metaKey && !e.altKey && !e.ctrlKey) {
        e.stopPropagation();
        e.preventDefault();
        mutateSelection({
          part: SelectionPart.ActiveCell,
          columnCount: reactTableInstance.allColumns.length,
          rowCount: reactTableInstance.rows.length,
          deltaColumns: 0,
          deltaRows: 0,
          isEditingActiveCell: true,
          keepInsideSelection: true,
        });
      }

      // TAB
      if (NavigationKeysUtils.isTab(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        if (e.shiftKey) {
          mutateSelection({
            part: SelectionPart.ActiveCell,
            columnCount: reactTableInstance.allColumns.length,
            rowCount: reactTableInstance.rows.length,
            deltaColumns: -1,
            deltaRows: 0,
            isEditingActiveCell: false,
            keepInsideSelection: true,
          });
        } else {
          mutateSelection({
            part: SelectionPart.ActiveCell,
            columnCount: reactTableInstance.allColumns.length,
            rowCount: reactTableInstance.rows.length,
            deltaColumns: 1,
            deltaRows: 0,
            isEditingActiveCell: false,
            keepInsideSelection: true,
          });
        }
      }

      // ARROWS

      const selectionPart = e.shiftKey ? SelectionPart.SelectionEnd : SelectionPart.ActiveCell;

      if (NavigationKeysUtils.isArrowLeft(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        mutateSelection({
          part: selectionPart,
          columnCount: reactTableInstance.allColumns.length,
          rowCount: reactTableInstance.rows.length,
          deltaColumns: -1,
          deltaRows: 0,
          isEditingActiveCell: false,
          keepInsideSelection: false,
        });
      }
      if (NavigationKeysUtils.isArrowRight(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        mutateSelection({
          part: selectionPart,
          columnCount: reactTableInstance.allColumns.length,
          rowCount: reactTableInstance.rows.length,
          deltaColumns: 1,
          deltaRows: 0,
          isEditingActiveCell: false,
          keepInsideSelection: false,
        });
      }
      if (NavigationKeysUtils.isArrowUp(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        mutateSelection({
          part: selectionPart,
          columnCount: reactTableInstance.allColumns.length,
          rowCount: reactTableInstance.rows.length,
          deltaColumns: 0,
          deltaRows: -1,
          isEditingActiveCell: false,
          keepInsideSelection: false,
        });
      }
      if (NavigationKeysUtils.isArrowDown(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        mutateSelection({
          part: selectionPart,
          columnCount: reactTableInstance.allColumns.length,
          rowCount: reactTableInstance.rows.length,
          deltaColumns: 0,
          deltaRows: 1,
          isEditingActiveCell: false,
          keepInsideSelection: false,
        });
      }

      // DELETE

      if (NavigationKeysUtils.isDelete(e.key) || NavigationKeysUtils.isBackspace(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        erase();
      }

      // ESC

      if (NavigationKeysUtils.isEsc(e.key)) {
        e.stopPropagation();
        e.preventDefault();
        resetSelectionAt(undefined);
        // FIXME: Tiago: Do it.
        // return focusParentCell(currentTarget);
      }

      // FIXME: Tiago -> This won't work well on non-macOS
      // COPY/CUT/PASTE
      if (!e.shiftKey && e.metaKey && e.key === "c") {
        e.stopPropagation();
        e.preventDefault();
        copy();
      }
      if (!e.shiftKey && e.metaKey && e.key === "x") {
        e.stopPropagation();
        e.preventDefault();
        cut();
      }
      if (!e.shiftKey && e.metaKey && e.key === "v") {
        e.stopPropagation();
        e.preventDefault();
        paste();
      }

      // FIXME: Tiago -> This won't work well on non-macOS
      // SELECT ALL
      if (!e.shiftKey && e.metaKey && e.key === "a") {
        e.stopPropagation();
        e.preventDefault();

        mutateSelection({
          part: SelectionPart.SelectionStart,
          columnCount: reactTableInstance.allColumns.length,
          rowCount: reactTableInstance.rows.length,
          deltaColumns: -(reactTableInstance.allColumns.length - 1),
          deltaRows: -(reactTableInstance.rows.length - 1),
          isEditingActiveCell: false,
          keepInsideSelection: false,
        });
        mutateSelection({
          part: SelectionPart.SelectionEnd,
          columnCount: reactTableInstance.allColumns.length,
          rowCount: reactTableInstance.rows.length,
          deltaColumns: +(reactTableInstance.allColumns.length - 1),
          deltaRows: +(reactTableInstance.rows.length - 1),
          isEditingActiveCell: false,
          keepInsideSelection: false,
        });
      }
    },
    [
      enableKeyboardNavigation,
      currentlyOpenContextMenu,
      resetSelectionAt,
      mutateSelection,
      reactTableInstance.allColumns.length,
      reactTableInstance.rows.length,
      erase,
      copy,
      cut,
      paste,
    ]
  );

  const headerRowsCount = useMemo(() => {
    const headerGroupsLength = skipLastHeaderGroup
      ? reactTableInstance.headerGroups.length - 1
      : reactTableInstance.headerGroups.length;

    switch (headerVisibility) {
      case BeeTableHeaderVisibility.AllLevels:
        return headerGroupsLength;
      case BeeTableHeaderVisibility.LastLevel:
        return headerGroupsLength - 1;
      case BeeTableHeaderVisibility.SecondToLastLevel:
        return headerGroupsLength - 1;
      default:
        return 0;
    }
  }, [headerVisibility, reactTableInstance.headerGroups.length, skipLastHeaderGroup]);

  const onRowAdded2 = useCallback(
    (args: { beforeIndex: number }) => {
      if (onRowAdded) {
        onRowAdded(args);
        adaptSelection({
          atRowIndex: args.beforeIndex,
          rowCountDelta: 1,
          atColumnIndex: -1,
          columnCountDelta: 0,
        });
      }
    },
    [adaptSelection, onRowAdded]
  );

  const onColumnAdded2 = useCallback(
    (args: { beforeIndex: number; groupType: string }) => {
      if (onColumnAdded) {
        onColumnAdded(args);
        adaptSelection({
          atRowIndex: -1,
          rowCountDelta: 0,
          // The columnIndex here does not count the rowIndex columns, but the selection does. So + 1.
          atColumnIndex: args.beforeIndex + 1,
          columnCountDelta: 1,
        });
      }
    },
    [adaptSelection, onColumnAdded]
  );

  const onRowDuplicated2 = useCallback(
    (args: { rowIndex: number }) => {
      if (onRowDuplicated) {
        onRowDuplicated(args);
        adaptSelection({
          atRowIndex: args.rowIndex,
          rowCountDelta: 1,
          atColumnIndex: -1,
          columnCountDelta: 0,
        });
      }
    },
    [adaptSelection, onRowDuplicated]
  );

  const onRowDeleted2 = useCallback(
    (args: { rowIndex: number }) => {
      if (onRowDeleted) {
        onRowDeleted(args);
        adaptSelection({
          atRowIndex: args.rowIndex,
          rowCountDelta: -1,
          atColumnIndex: -1,
          columnCountDelta: 0,
        });
      }
    },
    [adaptSelection, onRowDeleted]
  );

  const onColumnDeleted2 = useCallback(
    (args: { columnIndex: number; groupType: string }) => {
      if (onColumnDeleted) {
        onColumnDeleted(args);
        adaptSelection({
          atRowIndex: -1,
          rowCountDelta: 0,
          // The columnIndex here does not count the rowIndex columns, but the selection does. So + 1.
          atColumnIndex: args.columnIndex + 1,
          columnCountDelta: -1,
        });
      }
    },
    [adaptSelection, onColumnDeleted]
  );

  return (
    <div className={`table-component ${tableId}`} ref={tableRef} onKeyDown={onKeyDown}>
      <PfReactTable.TableComposable
        {...reactTableInstance.getTableProps()}
        variant="compact"
        ref={tableComposableRef}
        ouiaId="expression-grid-table"
      >
        <BeeTableHeader<R>
          editColumnLabel={editColumnLabel}
          isEditableHeader={isEditableHeader}
          getColumnKey={onGetColumnKey}
          headerVisibility={headerVisibility}
          onColumnUpdates={onColumnUpdates}
          skipLastHeaderGroup={skipLastHeaderGroup}
          tableColumns={columnsWithAddedIndexColumns}
          reactTableInstance={reactTableInstance}
          onColumnAdded={onColumnAdded2}
        />
        <BeeTableBody<R>
          getColumnKey={onGetColumnKey}
          getRowKey={onGetRowKey}
          headerVisibility={headerVisibility}
          headerRowsCount={headerRowsCount}
          reactTableInstance={reactTableInstance}
          additionalRow={additionalRow}
          onRowAdded={onRowAdded2}
        />
      </PfReactTable.TableComposable>
      <BeeTableContextMenuHandler
        tableRef={tableRef}
        operationConfig={operationConfig}
        reactTableInstance={reactTableInstance}
        onRowAdded={onRowAdded2}
        onRowDuplicated={onRowDuplicated2}
        onRowDeleted={onRowDeleted2}
        onColumnAdded={onColumnAdded2}
        onColumnDeleted={onColumnDeleted2}
      />
    </div>
  );
}

export function BeeTable<R extends object>(
  props: BeeTableProps<R> & {
    onColumnResizingWidthChange?: (args: { columnIndex: number; newResizingWidth: ResizingWidth }) => void;
  }
) {
  return (
    <BeeTableSelectionContextProvider>
      <BeeTableColumnResizingWidthsContextProvider onChange={props.onColumnResizingWidthChange}>
        <BeeTable2 {...props} />
      </BeeTableColumnResizingWidthsContextProvider>
    </BeeTableSelectionContextProvider>
  );
}

function BeeTableDefaultCell<R extends object>({
  cellProps,
  onCellUpdates,
  isReadOnly,
}: {
  isReadOnly: boolean;
  cellProps: ReactTable.CellProps<R>;
  onCellUpdates?: (cellUpdates: BeeTableCellUpdate<R>[]) => void;
}) {
  const { mutateSelection } = useBeeTableSelectionDispatch();

  const columnIndex = useMemo(() => {
    return cellProps.allColumns.findIndex((c) => c.id === cellProps.column.id);
  }, [cellProps.allColumns, cellProps.column.id]);

  const onCellChanged = useCallback(
    (value: string) => {
      onCellUpdates?.([
        {
          value,
          row: cellProps.row.original,
          rowIndex: cellProps.row.index,
          column: cellProps.column,
          columnIndex: columnIndex - 1, // Subtract one because of the rowIndex column.
        },
      ]);
    },
    [cellProps, columnIndex, onCellUpdates]
  );

  const setEditing = useCallback(
    (isEditing: boolean) => {
      mutateSelection({
        part: SelectionPart.ActiveCell,
        columnCount: cellProps.allColumns.length,
        rowCount: cellProps.rows.length,
        deltaColumns: 0,
        deltaRows: 0,
        isEditingActiveCell: isEditing,
        keepInsideSelection: true,
      });
    },
    [cellProps.allColumns.length, cellProps.rows.length, mutateSelection]
  );

  const getValue = useCallback(() => {
    return cellProps.value;
  }, [cellProps.value]);

  const { isActive, isEditing } = useBeeTableCell(cellProps.row.index, columnIndex, onCellChanged, getValue);

  const navigateVertically = useCallback(
    (args: { isShiftPressed: boolean }) => {
      mutateSelection({
        part: SelectionPart.ActiveCell,
        columnCount: cellProps.allColumns.length,
        rowCount: cellProps.rows.length,
        deltaColumns: 0,
        deltaRows: args.isShiftPressed ? -1 : 1,
        isEditingActiveCell: false,
        keepInsideSelection: true,
      });
    },
    [cellProps.allColumns.length, cellProps.rows.length, mutateSelection]
  );

  const navigateHorizontally = useCallback(
    (args: { isShiftPressed: boolean }) => {
      mutateSelection({
        part: SelectionPart.ActiveCell,
        columnCount: cellProps.allColumns.length,
        rowCount: cellProps.rows.length,
        deltaColumns: args.isShiftPressed ? -1 : 1,
        deltaRows: 0,
        isEditingActiveCell: false,
        keepInsideSelection: true,
      });
    },
    [cellProps.allColumns.length, cellProps.rows.length, mutateSelection]
  );

  return (
    <BeeTableEditableCellContent
      isEditing={isEditing}
      isActive={isActive}
      setEditing={setEditing}
      onChange={onCellChanged}
      value={cellProps.value}
      isReadOnly={isReadOnly}
      onFeelEnterKeyDown={navigateVertically}
      onFeelTabKeyDown={navigateHorizontally}
    />
  );
}
