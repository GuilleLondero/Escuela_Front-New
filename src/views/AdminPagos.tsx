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
  } = useAdminPagos();

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm border-0 rounded-2 bg-white text-dark">
        <h4 className="fw-bold mb-4">Gestión de Pagos por Alumno</h4>

        <div style={{ minHeight: "45px" }}>
          {mensaje && (
            <Alert variant={mensaje.includes("¡") ? "success" : "danger"}>
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
            <h5 className="mb-3">Registrar nuevo pago</h5>
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
            <Button variant="success" onClick={handleAgregarPago}>
              Registrar Pago
            </Button>
            {tieneEdicion && (
              <div className="mt-3">
                <Button variant="primary" onClick={handleConfirmarEdicion}>
                  Confirmar edición
                </Button>
              </div>
            )}
          </div>
        )}

        {pagosFiltrados.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Fecha</th>
                <th className="text-center">Carrera</th>
                <th className="text-center">Mes afectado</th>
                <th className="text-center">Monto</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td className="align-middle text-center">
                    {new Date(p.fecha_pago).toLocaleDateString()}
                  </td>
                  <td className="align-middle text-center">{p.carrera}</td>
                  <td className="align-middle text-center">{p.mes_afectado}</td>
                  <td className="align-middle text-center">${p.amount}</td>
                  <td className="align-middle text-center">
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
        ) : (
          selectedAlumno && (
            <p className="text-muted">No hay pagos cargados para este alumno.</p>
          )
        )}
      </Card>
    </div>
  );
};

export default AdminPagos;
