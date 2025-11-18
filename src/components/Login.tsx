import { useLoginForm } from "../hooks/useLoginForm";

function Login() {
  const { handleLogin, message, userInputRef, passInputRef, isSubmitting } =
    useLoginForm();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-3">Inicio de sesion</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="inputUser" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              className="form-control"
              id="inputUser"
              ref={userInputRef}
              aria-describedby="userHelp"
            />
            <div id="userHelp" className="form-text"></div>
          </div>

          <div className="mb-4">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Contrasena
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              ref={passInputRef}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
            )}
            {isSubmitting ? "Iniciando..." : "Ingresar"}
          </button>



          <span className="d-block mt-3 text-center text-danger">{message}</span>
        </form>
      </div>
    </div>
  );
}

export default Login;
