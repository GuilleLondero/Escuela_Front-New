import { Card, Form, Table, Button, Alert } from "react-bootstrap";
import Select from "react-select";
import { useAdminPagos } from "../hooks/useAdminPagos";

const AdminPagos = () => {
  const {
    alumnos,
    selectedAlumno,
    pagosFiltrados,
    filtroCarrera,
    carrerasDisponibles,
    mensaje,
    nuevoPago,
    carreraFilterOptions,
    carreraSelectOptions,
    handleAlumnoChange,
    handleFiltroCarreraChange,
    handleAgregarPago,
    handleNuevoPagoAmount,
    handleNuevoPagoMonth,
    handleNuevoPagoCarrera,
    handleEditarPago,
    handleEliminarPago,
    handleConfirmarEdicion,
    tieneEdicion,
    savingPago,
    updatingPago,
    pagoEditando,
  } = useAdminPagos();

  return (
    <div className="container mt-5">
      <Card className="shadow-sm border-0 bg-white text-dark">
        <Card.Header className="accent">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0 text-white">Gestion de Pagos por Alumno</h4>
              <small className="text-white-50">
                Crea, edita y filtra pagos desde un unico panel.
              </small>
            </div>
            <i className="bi bi-cash-stack fs-2 text-white opacity-75" />
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          <div style={{ minHeight: "45px" }}>
            {mensaje && (
              <Alert variant={mensaje.startsWith("OK") ? "success" : "danger"} className="rounded-3">
                {mensaje}
              </Alert>
            )}
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Seleccionar Alumno</Form.Label>
            <Form.Select value={selectedAlumno} onChange={handleAlumnoChange}>
              <option value="">-- Seleccionar --</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.username}>
                  {a.nombre} {a.apellido} ({a.username})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {carrerasDisponibles.length > 0 && (
            <Form.Group className="mb-4">
              <Form.Label>Filtrar por carrera</Form.Label>
              <Select
                isClearable
                placeholder="Todas"
                options={carreraFilterOptions}
                value={
                  filtroCarrera
                    ? carreraFilterOptions.find((option) => option.value === filtroCarrera) ?? null
                    : null
                }
                onChange={(option) => handleFiltroCarreraChange(option?.value ?? "")}
              />
            </Form.Group>
          )}

          {nuevoPago && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <h5 className="mb-0">Registrar nuevo pago</h5>
                {tieneEdicion && (
                  <span className="badge-soft px-3 py-1">
                    Editando pago #{pagoEditando?.id ?? ""}
                  </span>
                )}
              </div>

              <Form.Group className="mb-2">
                <Form.Label>Monto</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  placeholder="Ingresa el monto"
                  value={nuevoPago.amount}
                  onChange={(e) => handleNuevoPagoAmount(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Mes afectado</Form.Label>
                <Form.Control
                  type="month"
                  name="affected_month"
                  value={nuevoPago.affected_month}
                  onChange={(e) => handleNuevoPagoMonth(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Carrera</Form.Label>
                <Select
                  placeholder="Selecciona una carrera"
                  options={carreraSelectOptions}
                  value={carreraSelectOptions.find((opt) => opt.value === nuevoPago.id_career) ?? null}
                  onChange={(option) => handleNuevoPagoCarrera(option?.value ?? null)}
                />
              </Form.Group>
              <Button
                variant="success"
                onClick={handleAgregarPago}
                disabled={savingPago}
                className="d-flex align-items-center"
              >
                {savingPago && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {savingPago ? "Registrando..." : "Registrar Pago"}
              </Button>
              {tieneEdicion && (
                <div className="mt-3">
                  <Button
                    variant="primary"
                    onClick={handleConfirmarEdicion}
                    disabled={updatingPago}
                    className="d-flex align-items-center"
                  >
                    {updatingPago && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {updatingPago ? "Guardando..." : "Confirmar edicion"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {pagosFiltrados.length > 0 ? (
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead>
                  <tr>
                    <th className="text-center text-nowrap">Fecha</th>
                    <th className="text-center text-nowrap">Carrera</th>
                    <th className="text-center text-nowrap">Mes afectado</th>
                    <th className="text-center text-nowrap">Monto</th>
                    <th className="text-center text-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosFiltrados.map((p) => (
                    <tr key={p.id}>
                      <td className="text-center text-nowrap">
                        {new Date(p.fecha_pago).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        <span className="badge-soft px-3 py-1 d-inline-block">{p.carrera}</span>
                      </td>
                      <td className="text-center text-nowrap">{p.mes_afectado}</td>
                      <td className="text-center text-nowrap">${p.amount}</td>
                      <td className="text-center text-nowrap">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditarPago(p)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleEliminarPago(p.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            selectedAlumno && <p className="text-muted">No hay pagos cargados para este alumno.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminPagos;
