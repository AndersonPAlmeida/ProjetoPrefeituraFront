import React, {Component} from 'react'
import styles from './styles/ErrorTable.css'

class ErrorTable extends Component {
    constructor(props) {
        super(props)
    }

    fields(){
        return(
            <tr>
                <th>Erro</th>
                <th>Descrição</th>
            </tr>
        )
    }

    data(){
        return (
            <tbody>
                <tr>
                    <td>
                        Usuário já cadastrado
                    </td>
                    <td>
                        O usuário que você está tentando cadastrar já foi cadastrado anteriormente
                    </td>
                </tr>

                <tr>
                    <td>
                        CEP não pode ficar em branco
                    </td>
                    <td>
                        Você deve preencher o CEP de todos os cidadãos que você está cadastrando
                    </td>
                </tr>
                <tr>
                    <td>
                        Não é possível cadastrar um cidadão para outro município
                    </td>
                    <td>
                        O CEP que você está usando para cadastrar os cidadãos não pertence à sua cidade.
                    </td>
                </tr>
                <tr>
                    <td>
                        CEP inválido
                    </td>
                    <td>
                        O CEP está incorreto
                    </td>
                </tr>
                <tr>
                    <td>
                        Nome não pode ficar em branco
                    </td>
                    <td>
                        É obrigatório o preenchimento dos nomes do cidadãos
                    </td>
                </tr>
                <tr>
                    <td>
                        Nome inválido: Não pode ser usado números nem caracteres especiais e o tamanho deve ser menor que 255 caracteres
                    </td>
                    <td>
                        Para preencher o nome não é possível a utilização de números, tampouco caracteres especiais, além de que o tamanho máximo do nome é de 255 caracteres
                    </td>
                </tr>
                <tr>
                    <td>
                        CPF não pode ficar em branco
                    </td>
                    <td>
                        É obrigatório o preenchimento do CPF, pois este será usado como dado para login
                    </td>
                </tr>
                <tr>
                    <td>
                        CPF inválido
                    </td>
                    <td>
                        O CPF está incorreto
                    </td>
                </tr>
                <tr>
                    <td>
                        Número deve ser composto por até 10 algarismos
                    </td>
                    <td>
                        O número da residência do cidadão não pode ser maior que 9999999999 e apenas número podem ser digitados
                    </td>
                </tr>
                <tr>
                    <td>
                        Telefone 1 não pode ficar em branco
                    </td>
                    <td>
                        É obrigatório o preenchimento do Telefone 1
                    </td>
                </tr>
                <tr>
                    <td>
                        Telefone 1 deve ser no formato (99)9999-9999 ou (99)99999-9999
                    </td>
                    <td>
                        No telefone 1 deve ser digitado um dos modelos (99)9999-9999 ou (99)99999-9999
                    </td>
                </tr>
                <tr>
                    <td>
                        Telefone 1 deve ter no máximo 14 caracteres
                    </td>
                    <td>
                        O telefone 1 deve ser digitado seguindo um dos modelos (99)9999-9999 ou (99)99999-9999
                    </td>
                </tr>
                <tr>
                    <td>
                        Telefone 2 deve ser no formato (99)9999-9999 ou (99)99999-9999
                    </td>
                    <td>
                        No telefone 2 deve ser digitado um dos modelos (99)9999-9999 ou (99)99999-9999
                    </td>
                </tr>
                <tr>
                    <td>
                        Telefone 2 deve ter no máximo 14 caracteres
                    </td>
                    <td>
                        O telefone 2 deve ser digitado seguindo um dos modelos (99)9999-9999 ou (99)99999-9999
                    </td>
                </tr>
                <tr>
                    <td>
                        RG deve ser preenchido com no máximo 13 caracteres
                    </td>
                    <td>
                        RG não pode ter mais que 13 caracteres
                    </td>
                </tr>
                <tr>
                    <td>
                        Data de nascimento deve ser preenchida
                    </td>
                    <td>
                        É obrigatório o preenchimento da data de nascimento
                    </td>
                </tr>
                <tr>
                    <td>
                        Email deve ser no formato nomedoemail@provedor
                    </td>
                    <td>
                        O e-mail deve estar no padrão nomedoemail@provedor EXEMPLO: teste@gmail.com
                    </td>
                </tr>
            </tbody>
        )
    }
    render() {
        return(
            <div className='div-table'>
                <table className={styles['table-list']}>
                    <thead>
                        {this.fields()}
                    </thead>
                        {this.data()}
                </table>
            </div>
        )
    }
}
export default ErrorTable
