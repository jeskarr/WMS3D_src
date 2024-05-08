import { boundStore } from "@_lib/boundStore"
import { useEffect } from "react";

function TestComponent({elements, effect}) {
    const items = boundStore(elements);

    useEffect(() => effect(items), [items]);

  return null;
}

export default TestComponent;