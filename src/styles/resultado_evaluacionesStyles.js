import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

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
  backArrow: {
    fontSize: 28,
    color: colors.verdeOscuro,
  },
  detalleContainer: {
    paddingBottom: 10,
    borderRadius: 10,
  },
  detalleTitle: {
    backgroundColor: colors.bordeSuave,
    borderRadius: 10,
    paddingStart: 10,

  },
  infoDetalle:{
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginVertical: 20,


  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.verdeCritico,
    marginBottom: 12,
    marginTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingTop: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 130,
    color: colors.dark,
  },
  detailContent: {
    flex: 1,
    color: colors.black,
  },
  reportText: {
    color: colors.dark,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  reportBullet: {
    marginRight: 8,
    color: colors.verdeOscuro,
    fontWeight: 'bold',
  },
});
