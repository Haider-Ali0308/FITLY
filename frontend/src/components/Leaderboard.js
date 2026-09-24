import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [stats, setStats] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchLeaderboardData();
    fetchStats();
    if (userInfo?.email) {
      fetchUserRank();
    }
  }, [userInfo]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      setLeaderboardData(data.data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/leaderboard/stats");
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUserRank = async () => {
    try {
      const response = await fetch(`/api/leaderboard/user/${userInfo.email}`);
      const data = await response.json();
      setUserRank(data.data);
    } catch (error) {
      console.error("Error fetching user rank:", error);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 bg-yellow-100";
      case 2:
        return "text-gray-600 bg-gray-100";
      case 3:
        return "text-orange-600 bg-orange-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchLeaderboardData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h2>
          <p className="text-gray-600">
            Top performers based on average completion scores
          </p>
        </div>
        {stats && (
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {stats.totalUsers} active users • {stats.totalPlans} total plans
            </div>
            <div className="text-sm text-gray-500">
              Community average: {stats.averageScore}%
            </div>
          </div>
        )}
      </div>

      {/* User's Current Rank */}
      {userRank && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Your Current Rank</h3>
              <p className="text-sm text-gray-600">
                Keep improving to climb higher!
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRankColor(
                  userRank.rank
                )}`}
              >
                {getRankIcon(userRank.rank)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {userRank.averageScore}% avg • {userRank.totalPlans} plans
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {leaderboardData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Rank
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  User
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">
                  Avg Score
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">
                  Total Plans
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">
                  Workout Plans
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">
                  Meal Plans
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">
                  Total Points
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = userInfo?.email === user.email;

                return (
                  <tr
                    key={user.email}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      isCurrentUser ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <td className="py-4 px-2">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRankColor(
                          rank
                        )}`}
                      >
                        {getRankIcon(rank)}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Last active:{" "}
                            {new Date(user.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(100, user.averageScore)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {user.averageScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {user.totalPlans}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {user.workoutPlans}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {user.mealPlans}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="font-semibold text-gray-900">
                        {user.totalPoints}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No leaderboard data yet
          </h3>
          <p className="text-gray-500">
            Start creating and completing workout and meal plans to see the
            leaderboard!
          </p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchLeaderboardData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          🔄 Refresh Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
