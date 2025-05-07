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
    padding: 10,
    borderRadius: 10,
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
    marginLeft: 10,
    padding: 10,
    borderRadius: 30,
  },
  card: {
    backgroundColor: colors.lightCyan,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkBlue,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
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
    backgroundColor: colors.gray,
    marginRight: 10,
  },
  choiceChipSelected: {
    backgroundColor: colors.darkBlue,
  },
  datePicker: {
    backgroundColor: colors.lighterCyan,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
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
