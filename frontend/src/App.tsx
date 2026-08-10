import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <p>Page d'acceuil avec la navigation</p>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/blog/2">Blog numeroté</NavLink>
            </div>
          }
        />
        {/* <Route path="*" element={<h1>Page not found </h1>} /> */}
        <Route path="/blog" element={<h1>Page de bog</h1>} />
        <Route path="/blog/:userId" element={<Profile />} />
        <Route path="/contact" element={<h1>Page de contact</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

function Profile() {
  const { userId } = useParams();
  return (
    <div>
      <h1>Id :{Number(userId)}</h1>
    </div>
  );
}
