import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>;
  id: number;

  constructor(
    public validacao: ValidarCamposService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private activateRouter: ActivatedRoute,
    private filmesService: FilmesService,
    private router: Router
  ) { }

  get f(){
    return this.cadastro.controls;
  }

  ngOnInit(): void {
    this.id = this.activateRouter.snapshot.params['id'];

    if(this.id){
      this.filmesService.visualizar(this.id).subscribe((filme: Filme) => this.criarFormulario(filme));
    }else{
      this.criarFormulario(this.criarFormularioEmBranco());
    }

    this.generos = ['Ação', 'Romance', 'Aventura', 'Terror', 'Ficção Científica', 'Comédia', 'Drama'];
  }

  submit(): void{
    this.cadastro.markAllAsTouched();
    if(this.cadastro.invalid){
      return;
    }

    const filme = this.cadastro.getRawValue() as Filme;

    if(this.id){
      filme.id = this.id;
      this.editar(filme);
    }else{
      this.salvar(filme);
    }
  }

  reiniciarForm(): void{
    this.cadastro.reset();
  }

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private criarFormularioEmBranco(): Filme {
    return {
      titulo: null,
      urlFoto: null,
      dtLancamento: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme;
  }

  private salvar(filme: Filme): void {
    this.filmesService.salvar(filme).subscribe(()=>{
      const config = {
        data:{
          btnSucesso: 'Ir para a listagem',
          btnCancelar: 'Cadastrar novo filme',
          corBtnCancelar: 'primary',
          possuiBtnFechar: true

        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe((opcao:boolean) => {
        if(opcao){
          this.router.navigateByUrl('filmes');
        } else {
          this.reiniciarForm();
        }
      });
    },
    ()=>{
      const config = {
        data:{
          titulo: 'Erro ao salvar',
          descricao: 'Não foi possivel cadastrar',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
  }

  private editar(filme: Filme): void {
    this.filmesService.editar(filme).subscribe(()=>{
      const config = {
        data:{
          titulo: 'Alteração de registro',
          descricao: 'Registro atualizado com sucesso!',
          btnSucesso: 'Ir para a listagem',
        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe(() => {this.router.navigateByUrl('filmes')});
    },
    ()=>{
      const config = {
        data:{
          titulo: 'Erro editar!',
          descricao: 'Não foi possivel editar o registro!',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
  }

}
