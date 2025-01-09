import { FC, useEffect, useState } from "react"
import CodeBlock from "@theme/CodeBlock"

const Snippets: FC = () => {
    const [code, setCode] = useState(undefined)

    useEffect(() => {
        fetch("/global.code-snippets")
            .then(response => response.text())
            .then(setCode)
    }, [])

    return <CodeBlock language="json">{code}</CodeBlock>
}

export default Snippets
