import request from "supertest";

export const guestMockUser = {
  first_name: "testFirst",
  last_name: "testLast",
  email: "email",
  phone_number: 123456789,
  year: 2023,
  month: 9,
  day: 29,
  time: "9:00 PM",
  service: "Full Set",
  shape: "coffin",
  length: "Shorties",
  designs: "Full Frenchies",
  extras: ["Soak Off"],
  pedicure: null,
  inspirations: [],
};

export const mockUser = {
  first_name: "test",
  last_name: "example",
  email: "email",
  password: "password",
  phone_number: 123456789,
  appointments: {
    upcoming: [],
    past: [],
  },
  createdAt: "today",
  updatedAt: "today",
  role: "user",
};

export const mockImage = {
  _id: "66bd495ac2d874ec775b2707",
  user_id: "",
  category: "Nails",
  url: "test",
  title: "title",
  upload_date: "Wed Aug 14 2024 20:18:34 GMT-0400 (Eastern Daylight Time)",
  tags: ["test"],
};

export const uploadImageAndGetCookies = async (server: any, mockImage: any) => {
  const loginResponse = await request(server).post("/login").send({
    email: "email",
    password: "password",
  });

  const cookies = loginResponse.headers["set-cookie"];

  const postResponse = await request(server)
    .post("/api/auth/gallery")
    .set("Cookie", cookies)
    .send(mockImage);

  return { cookies, postResponse };
};
