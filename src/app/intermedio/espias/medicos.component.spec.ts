import { empty, from, Observable, of, throwError } from 'rxjs';
import { MedicosComponent } from './medicos.component';
import { MedicosService } from './medicos.service';


describe('MedicosComponent', () => {

    let componente: MedicosComponent;
    const servicio = new MedicosService(null);

    beforeEach(() => {
        componente = new MedicosComponent(servicio);
    });


    it('Init: Debe de cargar los medicos', () => {
        const medicos = ['medico1', 'medico2', 'medico3'];

        // Permite hacer peticiones falsas cuando algo suceda
        // Nota: aqui regresa un observable
        spyOn(servicio, 'getMedicos').and.callFake(() => {
            return from([medicos]);
        });

        componente.ngOnInit();

        expect(componente.medicos.length).toBeGreaterThan(0);
    });

    it('Debe de llamar al servidor para agregar un medico', () => {

        const espia = spyOn(servicio, 'agregarMedico').and.callFake(medico => {
            // Nota: empty esta obsoleto en angular 11 por lo que se puede usar un observable o un of
            // return of();
            return new Observable()
        });

        componente.agregarMedico();

        expect(espia).toHaveBeenCalled();
    });

    it('Debe de agregar un nuevo medico al arreglo de medicos', () => {
        const medico = {
            id: 1,
            nombre: 'Perla'
        };

        spyOn(servicio, 'agregarMedico').and.returnValue(
            from([medico])
        );

        componente.agregarMedico();

        expect(componente.medicos.indexOf(medico)).toBeGreaterThanOrEqual(0);
    });

    it('Si falla la adicion, la propiedad mensajeError, debe ser igual al error del servicio', () => {
        const miError = 'No se pudo agregar el medico';

        spyOn(servicio, 'agregarMedico').and.returnValue(
            throwError(miError)
        );

        componente.agregarMedico();

        expect(componente.mensajeError).toBe(miError);
    });

    it('Debe de llamar al servidor para borrar un medico', () => {
        // Para evitar hacerlo manualmente agregamos otro espia
        // En este caso llamamos a la ventana y le asignamos el valor true
        spyOn(window, 'confirm').and.returnValue(true);

        const espia = spyOn(servicio, 'borrarMedico').and.returnValue(of());

        componente.borrarMedico('1');

        // Que sea llamado con el dato 1
        expect(espia).toHaveBeenCalledWith('1');
    });

    it('NO debe de llamar al servidor para borrar un medico', () => {
        spyOn(window, 'confirm').and.returnValue(false);

        const espia = spyOn(servicio, 'borrarMedico').and.returnValue(of());

        componente.borrarMedico('1');

        expect(espia).not.toHaveBeenCalledWith('1');
    });

});
