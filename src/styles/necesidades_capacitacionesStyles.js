import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    padding: 16,
    paddingTop: 60,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: colors.verdeOscuro,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginLeft: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  filtroButton: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    backgroundColor: colors.fondo,
    borderColor: colors.verdeOscuro,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    fontSize: 14,
    color: colors.verdeOscuro,
    height: 40,
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
  },
  reiniciarButton: {
    backgroundColor: colors.red,
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: colors.verdeHoverCard,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    borderLeftColor: colors.verdeOscuro,
    borderLeftWidth: 4,

    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
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
    color: colors.verdeOscuro,
    fontSize: 12,
    marginTop: 6,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.verdeOscuro,
    fontSize: 16,
    textAlign: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
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
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
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
    marginTop: 20,
    alignItems: 'center',
  },
  applyButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
