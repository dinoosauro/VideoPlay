export default function AppendToBody(node: HTMLElement) {
    document.body.append(node);
    return {
        destroy: () => {
            node.remove();
            // @ts-ignore
            node = undefined;
        }
    }
}