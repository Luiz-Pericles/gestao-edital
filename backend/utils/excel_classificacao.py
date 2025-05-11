import pandas as pd
import math


# Função para classificar os itens conforme as regras

def classificar_itens(df: pd.DataFrame):
    nova_tabela = []

    for index, row in df.iterrows():
        valor_estimado = row['VALOR ESTIMADO']
        quantidade = row['QUANTIDADE']

        # Para o caso que o item é menor que 80k, ele apenas vai criar a coluna classificação com a classificação de tudo exclusivo e copia o restante da linha 
        if valor_estimado <= 80000:
            row['CLASSIFICAÇÃO'] = 'Exclusivo para ME/EPP'
            nova_tabela.append(row)
        else:
            # Para o caso que o item é maior que 80k e precisa fazer a divisão do item em cota e ampla concorrência. 
            # Nesse primeiro caso, ele vai verificar se os 25% é maior que 80k
            # Caso seja maior que 80k, ele vai limitar o valor da cota exclusiva até 80k, e consequetemente a '%' ficará menor que 25%
            cota_exclusiva_valor = valor_estimado * 0.25
            print(f"para o item {row['N']}, o cota_exclusiva_valor é: {cota_exclusiva_valor}")
            if cota_exclusiva_valor > 80000:
                cota_exclusiva_valor = 80000
                # Calcular a quantidade proporcional para a cota exclusiva com base no valor ajustado
                cota_exclusiva_quantidade = (quantidade * cota_exclusiva_valor) / valor_estimado
                # Arrendodar a quantidade para o menor número inteiro
                cota_exclusiva_quantidade = math.floor(cota_exclusiva_quantidade)
                cota_exclusiva_valor = (valor_estimado / quantidade) * cota_exclusiva_quantidade
            # Caso o valor dos 25% seja menor que 80k, então vai pegar a quantidade mais próxima dos 25%, dependendo do valor unitário do item 
            else:
                cota_exclusiva_quantidade = (quantidade * cota_exclusiva_valor) / valor_estimado
                cota_exclusiva_quantidade = math.floor(cota_exclusiva_quantidade)
                cota_exclusiva_valor = (valor_estimado / quantidade) * cota_exclusiva_quantidade
                

            if cota_exclusiva_valor != 0:
                item_cota_exclusiva = row.copy()
                item_cota_exclusiva['VALOR ESTIMADO'] = cota_exclusiva_valor
                item_cota_exclusiva['QUANTIDADE'] = cota_exclusiva_quantidade
                item_cota_exclusiva['CLASSIFICAÇÃO'] = 'Exclusivo para ME/EPP'
                texto_adicional = " - Respeitando o limite de até 25% em cumprimento à LEI COMPLEMENTAR Nº 123, DE 14 DE DEZEMBRO DE 2006"
                item_cota_exclusiva['DESCRIÇÃO'] = item_cota_exclusiva['DESCRIÇÃO'] + texto_adicional
                

            # Criar item para ampla concorrência
            cota_ampla_valor = valor_estimado - cota_exclusiva_valor
            cota_ampla_quantidade = quantidade - cota_exclusiva_quantidade
            item_cota_ampla = row.copy()
            item_cota_ampla['VALOR ESTIMADO'] = cota_ampla_valor
            item_cota_ampla['QUANTIDADE'] = cota_ampla_quantidade
            item_cota_ampla['CLASSIFICAÇÃO'] = 'Ampla concorrência'
            if 'item_cota_ampla' in locals():
                # Para adicionar a linha do item de cota ampla:
                nova_tabela.append(item_cota_ampla)
            if 'item_cota_exclusiva' in locals() and cota_exclusiva_valor != 0:
                # Para criar a linha do item exclusivo depois: 
                nova_tabela.append(item_cota_exclusiva)

    return pd.DataFrame(nova_tabela)