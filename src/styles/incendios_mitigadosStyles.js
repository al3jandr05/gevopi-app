import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lighterCyan,
    padding: 16,
    paddingTop: 60,
    
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
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.darkBlue,
    fontSize: 16,
    textAlign: 'center',
  },
});