import { data, type MetaFunction, Form, useNavigation } from 'react-router'
import { Route } from './+types.home'

export const meta: MetaFunction = () => {
  return [{ title: '日本の祝日' }]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url)
  const year =
    url.searchParams.get('year') ?? new Date().getFullYear().toString()

  try {
    const response = await fetch(
      `https://holidays-jp.github.io/api/v1/${year}/date.json`
    )
    const data: { [date: string]: string } = await response.json()
    const holidays = Object.entries(data).map(([date, name]) => ({
      date,
      name,
    }))
    return { year, holidays }
  } catch (error) {
    throw data(null, { status: 500 })
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { year, holidays } = loaderData

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full p-6 bg-white shadow-md rounded-md dark:bg-gray-800 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-center">日本の祝日一覧</h1>
        <Form method="get" className="mb-4 flex justify-center items-center">
          <label
            htmlFor="year"
            className="mr-2 text-gray-700 dark:text-gray-300"
          >
            年度選択:
          </label>
          <select
            name="year"
            id="year"
            defaultValue={year}
            onChange={(e) => e.target.form?.submit()}
            className="border p-2 rounded-md dark:bg-gray-700 dark:text-gray-100"
          >
            {[...Array(10)].map((_, index) => {
              const year = new Date().getFullYear() - index
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            })}
          </select>
        </Form>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {holidays.map(({ date, name }) => (
            <li key={date} className="py-2 flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {date}
              </span>
              <span className="text-gray-600 dark:text-gray-400">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
