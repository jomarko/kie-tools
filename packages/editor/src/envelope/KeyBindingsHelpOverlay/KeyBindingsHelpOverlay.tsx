/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
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

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@patternfly/react-core/dist/js/components/Modal";
import { KeyboardIcon } from "@patternfly/react-icons/dist/js/icons/keyboard-icon";
import { OperatingSystem } from "@kie-tooling-core/operating-system";
import { useKogitoEditorEnvelopeContext } from "../../api";
import { useEditorEnvelopeI18nContext } from "../i18n";
import { Cheetsheet } from "../Cheetsheet";

export function KeyBindingsHelpOverlay() {
  const [showing, setShowing] = useState(false);
  const envelopeContext = useKogitoEditorEnvelopeContext();
  const { i18n } = useEditorEnvelopeI18nContext();

  const toggle = useCallback(() => {
    setShowing(!showing);
  }, [showing]);

  const keyBindings = useMemo(() => {
    return removeDuplicatesByAttr(envelopeContext.services.keyboardShortcuts.registered(), "combination")
      .filter((k) => !k.opts?.hidden)
      .map((k) => {
        return {
          combination: handleMacOsCombination(k.combination, envelopeContext.operatingSystem),
          category: k.label.split("|")[0]?.trim(),
          label: k.label.split("|")[1]?.trim(),
        };
      })
      .reduce((lhs, rhs) => {
        if (!lhs.has(rhs.category)) {
          lhs.set(rhs.category, new Set([{ label: rhs.label, combination: rhs.combination }]));
        } else {
          lhs.get(rhs.category)!.add({ label: rhs.label, combination: rhs.combination });
        }
        return lhs;
      }, new Map<string, Set<{ label: string; combination: string }>>());
  }, [envelopeContext.services.keyboardShortcuts.registered()]);

  useEffect(() => {
    const id = envelopeContext.services.keyboardShortcuts.registerKeyPress(
      "shift+/",
      `${i18n.keyBindingsHelpOverlay.categories.help} | ${i18n.keyBindingsHelpOverlay.commands.showKeyboardOverlay}`,
      async () => setShowing(true),
      { element: window }
    );
    return () => envelopeContext.services.keyboardShortcuts.deregister(id);
  }, [i18n]);

  useEffect(() => {
    if (showing) {
      const id = envelopeContext.services.keyboardShortcuts.registerKeyPressOnce("esc", async () => setShowing(false), {
        element: window,
      });
      return () => envelopeContext.services.keyboardShortcuts.deregister(id);
    }
  }, [showing]);

  return (
    <>
      <div
        onClick={() => setShowing(!showing)}
        className={"kogito-tooling--keyboard-shortcuts kogito-tooling--keyboard-shortcuts-icon"}
        data-testid={"keyboard-shortcuts-help-overlay-icon"}
      >
        <KeyboardIcon />
      </div>

      <Modal
        appendTo={document.body}
        title={i18n.keyBindingsHelpOverlay.title}
        isOpen={showing}
        width={"60%"}
        onClose={toggle}
        data-testid={"keyboard-shortcuts-help-overlay"}
        className={"kogito-tooling--keyboard-shortcuts"}
      >
        <Cheetsheet
          keyBindings={keyBindings}
          feelFunctions={
            new Map([
              ["date", new Set([{ signature: "today()", documentation: "Returns the actual date." }])],
              [
                "number",
                new Set([
                  {
                    signature: "min([list])",
                    documentation: "Returns the element from the 'list' with minimal value.",
                  },
                  {
                    signature: "max([list])",
                    documentation: "Returns the element from the 'list' with maximal value.",
                  },
                ]),
              ],
              [
                "string",
                new Set([
                  {
                    signature: "substring(text, index)",
                    documentation:
                      "Returns a substring of the 'text' starting at 'index'. First letter of 'text' has index 1.",
                  },
                ]),
              ],
            ])
          }
        />
      </Modal>
    </>
  );
}

function handleMacOsCombination(combination: string, os?: OperatingSystem) {
  if (os === OperatingSystem.MACOS) {
    return combination.replace("ctrl", "cmd");
  }

  return combination;
}

function removeDuplicatesByAttr<T>(myArr: T[], prop: keyof T) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}
