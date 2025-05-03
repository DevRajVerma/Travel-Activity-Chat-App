"use client"

const ActivityCard = ({ activity, expanded = false, compact = false, onClick }) => {
  if (compact) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:border-blue-300 transition-colors"
      >
        <div className="flex">
          <div className="w-24 h-24 bg-cover bg-center" style={{ backgroundImage: `url(${activity.image})` }}></div>
          <div className="p-3 flex-1">
            <div className="font-medium">{activity.name}</div>
            <div className="text-sm text-gray-600">{activity.location}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {activity.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${activity.image})` }}>
        <div className="h-full w-full bg-black bg-opacity-20 flex items-end">
          <div className="p-4 text-white">
            <div className="font-medium text-lg">{activity.name}</div>
            <div className="text-sm opacity-90">{activity.location}</div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="mr-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {activity.duration}
          </span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {activity.area}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {activity.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-700 mb-4">{activity.description}</p>

        {expanded && (
          <div className="bg-gray-100 p-3 rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-1">Why we recommend this</h4>
            <p className="text-sm text-gray-700">{activity.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityCard
