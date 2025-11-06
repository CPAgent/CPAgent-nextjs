export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  return await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "email": email,
      "password": password
    }),
  });
}