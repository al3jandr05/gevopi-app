import { StyleSheet, Dimensions } from 'react-native';
import colors from '../themes/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  perfilContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.verdeOscuro,
    borderWidth: 3,
    borderColor: colors.verdeOscuro,
  },


  greenContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: height * 0.55,
    backgroundColor: colors.verdeOscuro,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    zIndex: -1,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  stressText: {
    color: colors.verdeSuave,
    fontSize: 16,
    marginBottom: 5,
  },
  stressBar: {
    backgroundColor: '#eee',
    width: '80%',
    height: 12,
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  stressFill: {
    height: '100%',
    borderRadius: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  circleButton: {
    backgroundColor: colors.fondo,
    width: 50,
    height: 50,
    borderRadius: 25,
    color: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    elevation: 3,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  emergenciaButton: {
    backgroundColor: colors.red,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    elevation: 3,
  },
  sectionCard: {
    backgroundColor: colors.verdeSuave,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 15,
  },
  widgetCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    width: '95%',
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderLeftColor: colors.verdeCritico,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    maxHeight: '90%',
  },
  
  modalScrollContent: {
    paddingBottom: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 20,
    textAlign: 'left',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    color: colors.textoPrincipal,
    fontWeight: 'bold',
  },

  carouselSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.verdeOscuro,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.fondo,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarInitial: {
    fontSize: 48,
    color: colors.verdeOscuro,
    fontWeight: 'bold',
  },


  modalSection: {
    marginBottom: 18,
  },
  modalLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: colors.verdeOscuro,
    fontSize: 15,
  },

  descripcionInput: {
    marginBottom: 6,
    borderColor: colors.gray,
    borderWidth: 1,
    color: colors.verdeOscuro,
    fontSize: 15,
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  enviarButton: {
    backgroundColor: colors.verdeOscuro,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  enviarButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },




  textArea: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: colors.dark,
    marginTop: 6,
  },
  dropdown: {
    height: 50,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    marginTop: 6,
  },

  placeholderStyle: {
    fontSize: 14,
    color: colors.gray,
  },

  selectedTextStyle: {
    fontSize: 14,
    color: colors.dark,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  loadingBox: {
    backgroundColor: colors.fondo,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
  },

  loadingSubtext: {
    fontSize: 14,
    color: colors.verdeOscuro,
    marginTop: 6,
  },

  carouselItem: {
    width: width - 64,
    paddingVertical: 10,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '98%',
    borderLeftWidth: 4,
    borderLeftColor: colors.verdeOscuro,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    flex: 1,
  },
  cardDate: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  emptyStateContainer: {
    backgroundColor: colors.white,
    width: '98%',
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: colors.verdeOscuro,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});