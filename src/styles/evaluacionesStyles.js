import { StyleSheet, Dimensions } from 'react-native';
import colors from '../themes/colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lighterCyan,
    padding: 20,
    paddingTop: 60,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 28,
    color: colors.darkBlue,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkBlue,
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
    borderColor: colors.darkBlue,
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
    paddingVertical: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkBlue,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.dark,
  },
  verButton: {
    backgroundColor: colors.darkBlue,
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
    color: colors.darkBlue,
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
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    marginRight: 10,
  },
  choiceChipSelected: {
    backgroundColor: colors.darkBlue,
  },
  datePicker: {
    padding: 14,
    backgroundColor: colors.inputBackground,
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
    backgroundColor: colors.darkBlue,
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
