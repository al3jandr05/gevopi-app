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
  bottomButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  bottomButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.white,
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 16,
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
  closeActionButton: {
    marginTop: 20,
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeActionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
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