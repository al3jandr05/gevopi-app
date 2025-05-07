import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lighterCyan,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: colors.darkBlue,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.darkBlue,
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
    borderColor: colors.darkBlue,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    fontSize: 14,
    color: colors.darkBlue,
  },
  reiniciarButton: {
    backgroundColor: colors.red,
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: colors.darkBlue,
    fontSize: 16,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: colors.darkBlue,
    fontSize: 13,
  },
  cardFecha: {
    color: colors.darkBlue,
    fontSize: 12,
    marginTop: 6,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.darkBlue,
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
    color: colors.dark,
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
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    marginRight: 10,
  },
  choiceChipSelected: {
    backgroundColor: colors.darkBlue,
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
    backgroundColor: colors.darkBlue,
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
