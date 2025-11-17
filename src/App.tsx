import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  loading?: boolean;
}

const Login: React.FC<LoginFormProps> = ({ onLogin, loading = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('用户名和密码不能为空');
      return;
    }
    setError('');
    onLogin(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">登录</h2>
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="请输入用户名"
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="请输入密码"
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`rounded px-4 py-2 font-bold text-white transition-colors ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700'
              }`}
            >
              {loading ? '登录中...' : '登录'}
            </button>
            <a href="#forgot" className="text-sm text-blue-600 hover:underline">
              忘记密码？
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

function App() {
  const handleLogin = (username: string, password: string) => {
    console.log('登录请求:', { username, password });
    // 执行登录逻辑
  };

  return <Login onLogin={handleLogin} />;
}

export default App;
