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
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { GenericSelector } from "../atoms";
import {
  BaselineMethod,
  MiningFunction,
  ReasonCodeAlgorithm
} from "@kogito-tooling/pmml-editor-marshaller";
import {
  Form,
  FormGroup,
  Label,
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  TextInput,
  Title,
  Tooltip
} from "@patternfly/react-core";
import "./CorePropertiesTable.scss";
import { Operation } from "../Operation";
import useOnclickOutside from "react-cool-onclickoutside";
import { isEqual } from "lodash";
import { useOperation } from "../OperationContext";
import { useValidationRegistry } from "../../../validation";
import { Builder } from "../../../paths";
import { HelpIcon } from "@patternfly/react-icons";
import { ValidationIndicatorLabel } from "../../EditorCore/atoms";
import set = Reflect.set;
import get = Reflect.get;

interface CoreProperties {
  modelIndex: number;
  isScorable: boolean | undefined;
  functionName: MiningFunction | undefined;
  algorithmName: string | undefined;
  baselineScore: number | undefined;
  baselineMethod: BaselineMethod | undefined;
  initialScore: number | undefined;
  areReasonCodesUsed: boolean;
  reasonCodeAlgorithm: ReasonCodeAlgorithm | undefined;
}

interface CorePropertiesTableProps extends CoreProperties {
  isBaselineScoreDisabled: boolean;
  commit: (props: CoreProperties) => void;
}

const GenericSelectorEditor = (
  id: string,
  items: string[],
  selection: string | undefined,
  onSelect: (_selection: string) => void,
  isDisabled?: boolean
) => {
  return (
    <GenericSelector
      id={id}
      items={items}
      selection={selection}
      onSelect={onSelect}
      isDisabled={isDisabled}
    />
  );
};

export const CorePropertiesTable = (props: CorePropertiesTableProps) => {
  const { activeOperation, setActiveOperation } = useOperation();

  const [isEditing, setEditing] = useState(false);
  const [isScorable, setScorable] = useState<boolean>();
  const [functionName, setFunctionName] = useState<MiningFunction>();
  const [algorithmName, setAlgorithmName] = useState<string | undefined>();
  const [baselineScore, setBaselineScore] = useState<number | undefined>();
  const [baselineMethod, setBaselineMethod] = useState<
    BaselineMethod | undefined
  >();
  const [initialScore, setInitialScore] = useState<number | undefined>();
  const [areReasonCodesUsed, setAreReasonCodesUsed] = useState<
    boolean | undefined
  >();
  const [reasonCodeAlgorithm, setReasonCodeAlgorithm] = useState<
    ReasonCodeAlgorithm | undefined
  >();

  useEffect(() => {
    setScorable(props.isScorable);
    setFunctionName(props.functionName);
    setAlgorithmName(props.algorithmName);
    setBaselineScore(props.baselineScore);
    setBaselineMethod(props.baselineMethod);
    setInitialScore(props.initialScore);
    setAreReasonCodesUsed(props.areReasonCodesUsed);
    setReasonCodeAlgorithm(props.reasonCodeAlgorithm);
  }, [props]);

  const ref = useOnclickOutside(() => onCommitAndClose(), {
    disabled: activeOperation !== Operation.UPDATE_CORE,
    eventTypes: ["click"]
  });

  const toNumber = (_value: string): number | undefined => {
    if (_value === "") {
      return undefined;
    }
    const n = Number(_value);
    if (isNaN(n)) {
      return undefined;
    }
    return n;
  };

  const toYesNo = (_value: boolean | undefined) => {
    return _value ? "Yes" : "No";
  };

  const onEdit = () => {
    setEditing(true);
    setActiveOperation(Operation.UPDATE_CORE);
  };

  const onCommitAndClose = () => {
    onCommit({});
    onCancel();
  };

  const onCommit = (partial: Partial<CoreProperties>) => {
    const existingPartial: Partial<CoreProperties> = {};
    Object.keys(partial).forEach((key) =>
      set(existingPartial, key, get(props, key))
    );

    if (!isEqual(partial, existingPartial)) {
      props.commit({ ...props, ...partial });
    }
  };

  const onCancel = () => {
    setEditing(false);
    setActiveOperation(Operation.NONE);
  };

  const isEditModeEnabled = useMemo(
    () => isEditing && activeOperation === Operation.UPDATE_CORE,
    [isEditing, activeOperation]
  );

  const { validationRegistry } = useValidationRegistry();
  const baselineScoreValidation = validationRegistry.get(
    Builder().forModel(props.modelIndex).forBaselineScore().build()
  );

  return (
    <div
      ref={ref}
      onClick={onEdit}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }
      }}
    >
      <PageSection
        variant={PageSectionVariants.light}
        className={
          isEditModeEnabled ? "editable-item--editing" : "editable-item"
        }
      >
        <Stack hasGutter={true}>
          <StackItem>
            <Split hasGutter={true}>
              <SplitItem>
                <Title size="lg" headingLevel="h1">
                  Model Setup
                </Title>
              </SplitItem>
              {!isEditModeEnabled && (
                <SplitItem>
                  {isScorable !== undefined &&
                    CorePropertyLabel("Is Scorable", toYesNo(isScorable))}
                  {functionName !== undefined &&
                    CorePropertyLabel("Function", functionName)}
                  {algorithmName !== undefined &&
                    CorePropertyLabel("Algorithm", algorithmName)}
                  {initialScore !== undefined &&
                    CorePropertyLabel("Initial Score", initialScore)}
                  {areReasonCodesUsed !== undefined &&
                    CorePropertyLabel(
                      "Use Reason Codes",
                      toYesNo(areReasonCodesUsed)
                    )}
                  {reasonCodeAlgorithm !== undefined &&
                    CorePropertyLabel(
                      "Reason Code Algorithm",
                      reasonCodeAlgorithm
                    )}
                  {baselineScore !== undefined &&
                    baselineScoreValidation.length === 0 &&
                    CorePropertyLabel("Baseline Score", baselineScore)}
                  {baselineScoreValidation.length > 0 && (
                    <ValidationIndicatorLabel
                      validations={baselineScoreValidation}
                      cssClass="core-properties__label"
                    >
                      <>
                        <strong>Baseline score:</strong>&nbsp;
                        <em>Missing</em>
                      </>
                    </ValidationIndicatorLabel>
                  )}
                  {baselineMethod !== undefined &&
                    CorePropertyLabel("Baseline Method", baselineMethod)}
                </SplitItem>
              )}
            </Split>
          </StackItem>
          {isEditModeEnabled && (
            <StackItem>
              <Form
                onSubmit={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="core-properties__container"
              >
                <Level hasGutter={true}>
                  <LevelItem>
                    <FormGroup label="Is Scorable" fieldId="core-isScorable">
                      <Switch
                        id="core-isScorable"
                        isChecked={isScorable === true}
                        onChange={(checked) => {
                          setScorable(checked);
                          onCommit({ isScorable: checked });
                        }}
                      />
                    </FormGroup>
                  </LevelItem>
                  <LevelItem>
                    <FormGroup
                      label="Function"
                      fieldId="core-functionName"
                      required={true}
                    >
                      {GenericSelectorEditor(
                        "core-functionName",
                        [
                          "associationRules",
                          "sequences",
                          "classification",
                          "regression",
                          "clustering",
                          "timeSeries",
                          "mixed"
                        ],
                        functionName,
                        (_selection) => {
                          setFunctionName(_selection as MiningFunction);
                          onCommit({
                            functionName: _selection as MiningFunction
                          });
                        },
                        // TODO {manstis] Scorecards are ALWAYS regression. We probably don't need this field.
                        // See http://dmg.org/pmml/v4-4/Scorecard.html
                        true
                      )}
                    </FormGroup>
                  </LevelItem>
                  <LevelItem>
                    <FormGroup label="Algorithm" fieldId="core-algorithmName">
                      <TextInput
                        type="text"
                        id="core-algorithmName"
                        name="core-algorithmName"
                        aria-describedby="core-algorithmName"
                        value={algorithmName ?? ""}
                        onChange={(e) => setAlgorithmName(e)}
                        onBlur={() => {
                          onCommit({ algorithmName: algorithmName });
                        }}
                      />
                    </FormGroup>
                  </LevelItem>
                  <LevelItem>
                    <FormGroup
                      label="Initial score"
                      fieldId="core-initialScore"
                    >
                      <TextInput
                        id="core-initialScore"
                        value={initialScore}
                        onChange={(e) => setInitialScore(toNumber(e))}
                        onBlur={() => {
                          onCommit({ initialScore: initialScore });
                        }}
                        type="number"
                      />
                    </FormGroup>
                  </LevelItem>
                  <LevelItem>
                    <FormGroup
                      label="Use reason codes?"
                      fieldId="core-useReasonCodes"
                    >
                      <Switch
                        id="core-useReasonCodes"
                        isChecked={areReasonCodesUsed}
                        onChange={(checked) => {
                          setAreReasonCodesUsed(checked);
                          onCommit({ areReasonCodesUsed: checked });
                        }}
                      />
                    </FormGroup>
                  </LevelItem>
                  <LevelItem>
                    <FormGroup
                      label="Reason code algorithm"
                      fieldId="core-reasonCodeAlgorithm"
                    >
                      {GenericSelectorEditor(
                        "core-reasonCodeAlgorithm",
                        ["pointsAbove", "pointsBelow"],
                        reasonCodeAlgorithm,
                        (_selection) => {
                          setReasonCodeAlgorithm(
                            _selection as ReasonCodeAlgorithm
                          );
                          onCommit({
                            reasonCodeAlgorithm: _selection as ReasonCodeAlgorithm
                          });
                        },
                        // Reason Code Algorithm is only required when Reason Codes are enabled.
                        // See http://dmg.org/pmml/v4-4/Scorecard.html
                        !areReasonCodesUsed
                      )}
                    </FormGroup>
                  </LevelItem>
                  <LevelItem>
                    <FormGroup
                      label="Baseline score"
                      fieldId="core-baselineScore"
                      validated={
                        baselineScoreValidation.length > 0
                          ? "warning"
                          : "default"
                      }
                      helperText={
                        baselineScoreValidation.length > 0
                          ? baselineScoreValidation[0].message
                          : undefined
                      }
                      labelIcon={
                        <Tooltip
                          content={
                            areReasonCodesUsed && props.isBaselineScoreDisabled
                              ? `A Baseline score is already provided inside all Characteristics`
                              : `
                                When Use Reason Codes is set to yes, a Baseline score value must be provided. \
                                Alternatively you can provide a Baseline score for all the characteristics
                                `
                          }
                        >
                          <button
                            aria-label="More information for Baseline score"
                            onClick={(e) => e.preventDefault()}
                            className="pf-c-form__group-label-help"
                          >
                            <HelpIcon
                              style={{
                                color: "var(--pf-global--info-color--100)"
                              }}
                            />
                          </button>
                        </Tooltip>
                      }
                    >
                      <TextInput
                        id="core-baselineScore"
                        value={baselineScore ?? ""}
                        onChange={(e) => setBaselineScore(toNumber(e))}
                        onBlur={() => {
                          onCommit({ baselineScore: baselineScore });
                        }}
                        type="number"
                        validated={
                          baselineScoreValidation.length > 0
                            ? "warning"
                            : "default"
                        }
                        isDisabled={props.isBaselineScoreDisabled}
                      />
                    </FormGroup>
                  </LevelItem>
                  <LevelItem>
                    <FormGroup
                      label="Baseline method"
                      fieldId="core-baselineMethod"
                    >
                      {GenericSelectorEditor(
                        "core-baselineMethod",
                        ["max", "min", "mean", "neutral", "other"],
                        baselineMethod,
                        (_selection) => {
                          setBaselineMethod(_selection as BaselineMethod);
                          onCommit({
                            baselineMethod: _selection as BaselineMethod
                          });
                        },
                        // Baseline Method is only required when Reason Codes are enabled.
                        // See http://dmg.org/pmml/v4-4/Scorecard.html
                        !areReasonCodesUsed
                      )}
                    </FormGroup>
                  </LevelItem>
                </Level>
              </Form>
            </StackItem>
          )}
        </Stack>
      </PageSection>
    </div>
  );
};

const CorePropertyLabel = (name: string, value: any) => {
  return (
    <Label color="cyan" className="core-properties__label">
      <strong>{name}:</strong>
      &nbsp;
      <span>{value}</span>
    </Label>
  );
};
