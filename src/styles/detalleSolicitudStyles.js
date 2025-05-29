import { StyleSheet, Dimensions } from 'react-native';
import colors from '../themes/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: colors.verdeOscuro,
    borderRadius: 20,
    padding: 10,
  },
  map: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 50,
    textAlign: 'center',
  },
  modalTitle2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: colors.dark,
    flexShrink: 1,
  },
  accionButton: {
    marginTop: 16,
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  accionButtonDisabled: {
    backgroundColor: colors.gray,
  },
  accionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginTop: 20,
    marginBottom: 10,
  },
  agregarVoluntarioBtn: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
    borderRadius: 8,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  agregarVoluntarioText: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
  },
  busquedaContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.inputBackground,
    marginBottom: 10,
  },
  listaVoluntarios: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  voluntarioItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  voluntarioNombre: {
    fontSize: 16,
    color: colors.dark,
  },
  voluntariosAsignadosContainer: {
    marginBottom: 15,
  },
  voluntarioSeleccionado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.lightGreen,
    borderRadius: 8,
    marginTop: 8,
  },
  voluntarioText: {
    fontSize: 15,
    color: colors.dark,
  },
  contadorVoluntarios: {
    textAlign: 'right',
    marginBottom: 5,
    color: colors.gray,
    fontSize: 14,
  },
  sinResultados: {
    textAlign: 'center',
    paddingVertical: 15,
    color: colors.gray,
  },
});