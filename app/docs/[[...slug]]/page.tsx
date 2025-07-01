export default async function DocsPage({params}: {params: Promise<{slug: string[]}>}){
    const {slug} = await params

    if(slug?.length == 2){
        return (
            <h1>viewing docs for feature <strong>{slug[0]}</strong> and concept <strong>{slug[1]}</strong></h1>
        )
    }

    if(slug?.length == 1){
        return (
            <h1>viewing docs for feature <strong>{slug[0]}</strong></h1>
        )
    }

    return (
        <div>docs home page</div>
    )
}