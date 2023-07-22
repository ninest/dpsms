export default function LoginPage() {
  return (
    <main className="w-3/4 mx-auto my-5">
      <h1 className="text-7xl font-bold mb-10">Login</h1>

      <form className="space-y-5">
        <fieldset>
          <label htmlFor="username" className="font-bold">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="border p-2 rounded-lg block w-full hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-indigo-600"
          />
        </fieldset>

        <fieldset>
          <label htmlFor="password" className="font-bold">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border p-2 rounded-lg block w-full hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-indigo-600"
          />
        </fieldset>
        <button>Submit</button>
      </form>
    </main>
  );
}
