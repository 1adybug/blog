import { FC, useEffect, useState } from "react"
import CodeBlock from "@theme/CodeBlock"

export interface CodeProps {
    url: string
}

const Code: FC<CodeProps> = ({ url }) => {
    const [code, setCode] = useState(undefined)

    useEffect(() => {
        fetch(url)
            .then(response => response.text())
            .then(setCode)
    }, [url])

    return <CodeBlock language="json">{code}</CodeBlock>
}

export default Code
