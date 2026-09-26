// Dev-only (see pageExtensions in next.config.js): new draft form.
type Props = { searchParams: Promise<Record<string, string | undefined>> }

const NewPost = async ({ searchParams }: Props) => {
  const { slug, title, error } = await searchParams
  return (
    <>
      <h1>新規記事（下書き）</h1>
      {error && <pre role="alert">{error}</pre>}
      <form action="/api/posts/" method="post" className="new-post">
        <label>
          slug
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={slug}
          />
        </label>
        <label>
          タイトル
          <input name="title" required defaultValue={title} />
        </label>
        <button type="submit">作成</button>
      </form>
      <p>
        date は今日、published は false で posts.json に追加。公開時は
        published を true に。
      </p>
    </>
  )
}
export default NewPost
