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

import { State, TestScenarioDataObject } from "../TestScenarioEditorStore";

/* The scope of this logic is to retrieve the Data Objects from the scesim file itself */
export function computeTestScenarioDataObjects(
  factMappings: State["scesim"]["model"]["ScenarioSimulationModel"]["simulation"]["scesimModelDescriptor"]["factMappings"]["FactMapping"]
) {
  const factsMappings = factMappings ?? [];
  const dataObjects: TestScenarioDataObject[] = [];

  /* The first two FactMapping are related to the "Number" and "Description" columns.      */
  /* If those columns only are present, no Data Objects can be detected in the scesim file */
  for (let i = 2; i < factsMappings.length; i++) {
    if (factsMappings[i].className!.__$$text === "java.lang.Void") {
      continue;
    }
    const factID = factsMappings[i].expressionElements!.ExpressionElement![0].step.__$$text;
    const dataObject = dataObjects.find((value) => value.id === factID);
    const isSimpleTypeFact = factsMappings[i].expressionElements!.ExpressionElement!.length === 1;
    const propertyID = isSimpleTypeFact // TO BE REVIEWED IN https://github.com/apache/incubator-kie-issues/issues/1514
      ? factsMappings[i].expressionElements!.ExpressionElement![0].step.__$$text.concat(".")
      : factsMappings[i]
          .expressionElements!.ExpressionElement!.map((expressionElement) => expressionElement.step.__$$text)
          .join(".");
    const propertyName = isSimpleTypeFact
      ? "value"
      : factsMappings[i].expressionElements!.ExpressionElement!.slice(-1)[0].step.__$$text;

    if (dataObject) {
      if (!dataObject.children?.some((value) => value.id === propertyID)) {
        dataObject.children!.push({
          id: propertyID,
          customBadgeContent: factsMappings[i].className.__$$text,
          isSimpleTypeFact: isSimpleTypeFact,
          name: propertyName,
        });
      }
    } else {
      dataObjects.push({
        id: factID,
        name: factsMappings[i].factAlias!.__$$text,
        customBadgeContent: factsMappings[i].factIdentifier!.className!.__$$text,
        children: [
          {
            id: propertyID,
            name: propertyName,
            customBadgeContent: factsMappings[i].className.__$$text,
          },
        ],
      });
    }
  }

  return dataObjects;
}
