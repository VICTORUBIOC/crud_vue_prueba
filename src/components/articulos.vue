<template>
  <div class="container">
    <v-alert
      dense
      outlined
      dismissible
      v-model="mostrarAlerta"
      :type="tipoAlerta"
    >
      {{mensaje}}
    </v-alert>
    <v-card>
      <v-card-title>
        ARTICULOS
      </v-card-title>
      <v-card-subtitle>
        CRUD de articulos
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :items="articulos"
        sort-by="descripcion"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>LISTADO DE ARTÍCULOS</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon
                    small
                  >
                    mdi-plus
                  </v-icon>
                  CREAR ARTICULO
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="form.descripcion"
                          label="Descripcion"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="form.precio"
                          label="Precio"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="form.stock"
                          label="Stock"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>  
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="close"
                  >
                    CANCELAR
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary darken-1"
                    
                    @click="save"
                  >
                    GUARDAR
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Seguro de elimnar este artículo?</v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn color="red darken-1" text @click="closeDelete">CANCELAR</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary "  @click="deleteItemConfirm">ELIMINAR</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          No hay datos registrados
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
export default {
  name:"Articulos",
  data: () => ({
      mostrarAlerta : false,
      tipoAlerta : 'success',
      mensaje : '',
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'DESCRIPCION',
          align: 'start',
          sortable: false,
          value: 'descripcion',
        },
        { text: 'PRECIO', value: 'precio' },
        { text: 'STOCK', value: 'stock' },
        { text: 'ACCIONES', value: 'actions', sortable: false },
      ],
      articulos: [],
      editedIndex: -1,
      articulo : {},
      form: {
        descripcion: null,
        precio: null,
        stock: null,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'CREAR ARTICULO' : 'EDITAR ARTICULO'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      alert(tipo, msj) {
        this.mostrarAlerta = true
        this.tipoAlerta = tipo
        this.mensaje = msj
      },
      async initialize() {
        await this.$axios.get('articulos')
        .then(response => {
          this.articulos = response.data
        })
        .catch( error => {
          console.log(error)
        })
      },
      refresh() {
        this.form = {
          descripcion: null,
          precio: null,
          stock: null,
        }
      },
      editItem (item) {
        this.editedIndex = this.articulos.indexOf(item)
        this.articulo = item
        this.form = {
          descripcion: item.descripcion,
          precio: item.precio,
          stock: item.stock,
        }
        this.dialog = true
      },

      deleteItem (item) {
        this.articulo = item
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        await this.$axios.delete(`articulos/${this.articulo.id}`, this.form)
        .then(response => {
          this.initialize(response)
          this.closeDelete()
          this.alert('success', 'Se eliminó correctamente');
        })
        .catch( error => {
          console.log(error)
            this.alert('error', 'Hubo un error al eliminar el registro, por favor intente nuevamente');
        })
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedIndex = -1
        })
      },

      async save () {
        if (this.editedIndex > -1) {
          console.log('debe q ser el PUT')
          console.log(`articulos/${this.articulo.id}`)
          await this.$axios.put(`articulos/${this.articulo.id}`, this.form)
          .then(response => {
            this.initialize(response)
            this.alert('success', 'Se editó correctamente');
            this.refresh()
          })
          .catch( error => {
            this.alert('error', 'Hubo un error, no se pudo actualizar el artículo.')
            console.log(error)
          })
        } else {
          await this.$axios.post('articulos', this.form)
          .then(response => {
            this.initialize(response)
            this.alert('success', 'Se creó el artículo correctamente');
            this.refresh()
          })
          .catch( error => {
            this.alert('error', 'Hubo un error, no se pudo crear el artículo.')
            console.log(error)
          })
        }
        this.close()
      },
    },
}
</script>