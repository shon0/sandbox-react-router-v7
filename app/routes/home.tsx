import { data, type MetaFunction, LoaderFunction } from 'react-router'
import { Route } from './+types.home'

export const meta: MetaFunction = () => {
  return [{ title: '日本の祝日' }]
}

export const loader = async () => {
  try {
    const response = await fetch(
      'https://holidays-jp.github.io/api/v1/2024/date.json'
    )
    const data: { [date: string]: string } = await response.json()
    const holidays = Object.entries(data).map(([date, name]) => ({
      date,
      name,
    }))
    return { holidays }
  } catch (error) {
    throw data(null, { status: 500 })
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { holidays } = loaderData
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full p-6 bg-white shadow-md rounded-md dark:bg-gray-800 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-center">
          2024年の日本の祝日一覧
        </h1>
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
