/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDevUIAppContext } from "../../contexts/DevUIAppContext";
import { ProcessListState } from "@kie-tools/runtime-tools-process-gateway-api/dist/types";
import { OUIAProps, componentOuiaProps } from "@kie-tools/runtime-tools-components/dist/ouiaTools";
import { EmbeddedProcessList } from "@kie-tools/runtime-tools-process-enveloped-components/dist/processList";
import {
  ProcessListGatewayApi,
  useProcessListGatewayApi,
} from "@kie-tools/runtime-tools-process-webapp-components/dist/ProcessList";
import { ProcessInstance } from "@kie-tools/runtime-tools-process-gateway-api/dist/types";

interface ProcessListContainerProps {
  initialState: ProcessListState;
}

const ProcessListContainer: React.FC<ProcessListContainerProps & OUIAProps> = ({ initialState, ouiaId, ouiaSafe }) => {
  const history = useHistory();
  const gatewayApi: ProcessListGatewayApi = useProcessListGatewayApi();
  const appContext = useDevUIAppContext();

  useEffect(() => {
    const onOpenInstanceUnsubscriber = gatewayApi.onOpenProcessListen({
      onOpen(process: ProcessInstance) {
        history.push({
          pathname: `/Process/${process.id}`,
          state: gatewayApi.processListState,
        });
      },
    });
    return () => {
      onOpenInstanceUnsubscriber.unSubscribe();
    };
  }, []);

  return (
    <EmbeddedProcessList
      {...componentOuiaProps(ouiaId, "process-list-container", ouiaSafe)}
      driver={gatewayApi}
      targetOrigin={appContext.getDevUIUrl()}
      initialState={initialState}
      singularProcessLabel={appContext.customLabels.singularProcessLabel}
      pluralProcessLabel={appContext.customLabels.pluralProcessLabel}
    />
  );
};

export default ProcessListContainer;
