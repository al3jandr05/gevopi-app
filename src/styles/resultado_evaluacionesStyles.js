import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    paddingTop: 60,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,

    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.verdeOscuro,
    textAlign: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  
  // Tarjeta de resumen
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    flex: 1,
  },
  evaluationTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 10,
  },
  physicalBadge: {
    backgroundColor: colors.verdeClaro,
  },
  emotionalBadge: {
    backgroundColor: colors.azulClaro,
  },
  evaluationTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  summaryDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.bordeSuave,
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    color: colors.texto,
    fontSize: 15,
  },
  
  // Sección de informe
  reportSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.bordeSuave,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginLeft: 10,
  },
  
  // Subsecciones
  subSection: {
    marginBottom: 20,
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.verdeCritico,
    marginRight: 8,
  },
  contentBox: {
    backgroundColor: colors.fondoClaro,
    borderRadius: 8,
    padding: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    marginRight: 8,
  },
  listText: {
    flex: 1,
    color: colors.texto,
    fontSize: 15,
    lineHeight: 22,
  },
  
  // Estado vacío
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.fondoClaro,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyText: {
    marginLeft: 10,
    color: colors.gris,
    fontSize: 15,
  },
  
  // Botón de acción
  actionButton: {
    backgroundColor: colors.verdeOscuro,
    borderRadius: 8,
    padding: 16,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});