/**
 * This file contains assertion function for TypeScript
 */

export function assertIsInputElement(eventTarget: EventTarget | null): asserts eventTarget is HTMLInputElement | HTMLTextAreaElement {
  if (!eventTarget || !(eventTarget instanceof HTMLInputElement || eventTarget instanceof HTMLTextAreaElement)) {
    throw new Error('Not an Input Element')
  }
}

export function assertIsHTMLElement(eventTarget: EventTarget | null): asserts eventTarget is HTMLElement {
  if (!eventTarget || !(eventTarget instanceof HTMLElement)) {
    throw new Error('Not a node')
  }
}

export function assertIsNode(eventTarget: EventTarget | null): asserts eventTarget is Node {
  if (!eventTarget || !('nodeType' in eventTarget)) {
    throw new Error('Not a node')
  }
}