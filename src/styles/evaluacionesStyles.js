import { StyleSheet, Dimensions } from 'react-native';
import colors from '../themes/colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    padding: 20,
    paddingTop: 60,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginLeft: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filtroButton: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
  },
  reiniciarButton: {
    backgroundColor: colors.red,
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    borderRadius: 12,
    color: colors.black,
    height: 40,
    paddingVertical: 10,
    borderColor: colors.verdeOscuro,
    borderWidth: 1,
  },
  buscador: {
    backgroundColor: colors.verdeHoverCard,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    width: '98%',
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderLeftColor: colors.verdeCritico,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.black,
  },
  cardFecha: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: 'bold',
  },
  verButton: {
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  verButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
  },
  choiceChipSelected: {
    backgroundColor: colors.verdeOscuro,
  },
  datePicker: {
    padding: 14,
    borderRadius: 1,
    marginBottom: 10,

  },
  rangoFechaToggle: {
    padding: 14,
    backgroundColor: '#c7cdd3',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  applyButton: {
    backgroundColor: colors.verdeOscuro,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});