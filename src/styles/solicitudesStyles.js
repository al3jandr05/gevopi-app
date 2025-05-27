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
    backButton: {
        padding: 8,
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
        marginBottom: 12,
    },
    search: {
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
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderLeftColor: colors.verdeCritico,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.verdeOscuro,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.black,
        marginBottom: 4,
    },
    cardState: {
        fontSize: 16,
        color: colors.black,
        marginBottom: 4,
        fontWeight: 'bold',

    },
    cardFecha: {
        color: colors.black,
        fontSize: 12,
        marginBottom: 8,
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
        color: colors.dark,
        marginBottom: 8,
    },
    datePicker: {
        padding: 14,
        backgroundColor: colors.inputBackground,
        borderRadius: 10,
        marginBottom: 10,
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
    emptyText: {
        color: colors.gray,
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});
